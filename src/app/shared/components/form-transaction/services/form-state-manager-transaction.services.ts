import { Injectable } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { BehaviorSubject, combineLatest, of } from 'rxjs';

export interface FormState {
  isLoading: boolean;
  isEdit: boolean;
  showAdvancedOptions: boolean;
  showRecurrenceOptions: boolean;
  isDirty: boolean;
  isValid: boolean;
}

@Injectable()
export class FormStateTransactionManagerService {
  private _state = new BehaviorSubject<FormState>({
    isLoading: false,
    isEdit: false,
    showAdvancedOptions: false,
    showRecurrenceOptions: false,
    isDirty: false,
    isValid: false
  });

  public state$ = this._state.asObservable();

  get currentState(): FormState {
    return this._state.getValue();
  }

  updateState(updates: Partial<FormState>): void {
    this._state.next({
      ...this.currentState,
      ...updates
    });
  }

  setupFormWatchers(form: FormGroup): void {
    const recurringControl = form.get('recurring') as FormControl<boolean>

    recurringControl.valueChanges.subscribe(isRecurring => {
      this.handleRecurrenceChange(form, isRecurring);
    });

    combineLatest([
      form.get('installment')?.valueChanges || of(false),
      form.get('recurring')?.valueChanges || of(false)
    ]).subscribe(([installment, recurring]) => {
      this.handleInstallmentRecurrenceConflict(form, installment, recurring);
    });

    const paidControl = form.get('paid') as FormControl<boolean>;
    paidControl?.valueChanges.subscribe(isPaid => {
      this.handlePaidStatusChange(form, isPaid);
    });

    combineLatest([
      form.get('paymentDate')?.valueChanges || of(null),
      form.get('dueDate')?.valueChanges || of(null)
    ]).subscribe(([paymentDate, dueDate]) => {
      this.handlePaymentDateValidation(form, paymentDate, dueDate);
    });

    form.valueChanges.subscribe(values => {
      this.autoExpandSections(values);
    });

    form.statusChanges.subscribe(() => {
      this.updateState({
        isValid: form.valid,
        isDirty: form.dirty
      });
    });
  }


  private handlePaidStatusChange(form: FormGroup, isPaid: boolean): void {
    const paymentDateControl = form.get('paymentDate');

    if (!paymentDateControl) {
      console.warn('Campo "paymentDate" não encontrado no formulário');
      return;
    }

    if (isPaid) {
      if (!paymentDateControl.value) {
        paymentDateControl.setValue(new Date(), { emitEvent: false });
      }
      paymentDateControl.setValidators([Validators.required]);
    } else {
      paymentDateControl.setValue(null, { emitEvent: false });
      paymentDateControl.clearValidators();
    }

    paymentDateControl.updateValueAndValidity();
  }

  private handlePaymentDateValidation(form: FormGroup, paymentDate: Date | null, dueDate: Date | null): void {
    const paymentDateControl = form.get('paymentDate');

    if (!paymentDateControl || !paymentDate || !dueDate) {
      return;
    }

    const paymentDateOnly = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), paymentDate.getDate());
    const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());

    const currentErrors = paymentDateControl.errors || {};
    delete currentErrors['paymentBeforeDue'];

    if (paymentDateOnly < dueDateOnly) {
      paymentDateControl.setErrors({
        ...currentErrors,
        paymentBeforeDue: true
      });
    } else if (Object.keys(currentErrors).length === 0) {
      paymentDateControl.setErrors(null);
    } else {
      paymentDateControl.setErrors(currentErrors);
    }
  }

  private handleRecurrenceChange(form: FormGroup, isRecurring: boolean): void {
    const recurrenceTypeControl = form.get('recurrenceType');
    const periodicityControl = form.get('periodicity');

    if (isRecurring) {
      recurrenceTypeControl?.setValidators([Validators.required]);
      periodicityControl?.setValidators([Validators.required, Validators.min(1)]);
      this.updateState({ showRecurrenceOptions: true });
    } else {
      recurrenceTypeControl?.clearValidators();
      periodicityControl?.clearValidators();
      form.patchValue({
        recurrenceType: null,
        periodicity: 1
      }, { emitEvent: false });
    }

    recurrenceTypeControl?.updateValueAndValidity();
    periodicityControl?.updateValueAndValidity();
  }

  private handleInstallmentRecurrenceConflict(form: FormGroup, installment: boolean, recurring: boolean): void {
    if (installment && recurring) {
      form.patchValue({ installment: false }, { emitEvent: false });
    }
  }

  private autoExpandSections(values: any): void {
    const shouldShowAdvanced = values.observations || values.paid || values.dueDate || values.installment;
    const shouldShowRecurrence = values.recurring;

    this.updateState({
      showAdvancedOptions: shouldShowAdvanced,
      showRecurrenceOptions: shouldShowRecurrence
    });
  }

  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  setEditMode(isEdit: boolean): void {
    this.updateState({ isEdit });
  }

  reset(): void {
    this.updateState({
      isLoading: false,
      showAdvancedOptions: false,
      showRecurrenceOptions: false,
      isDirty: false,
      isValid: false
    });
  }
}
