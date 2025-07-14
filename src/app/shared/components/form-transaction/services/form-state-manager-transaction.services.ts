import { Injectable } from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';

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
    form.get('recurring')?.valueChanges.subscribe(isRecurring => {
      this.handleRecurrenceChange(form, isRecurring);
    });

    combineLatest([
      form.get('installment')?.valueChanges || of(false),
      form.get('recurring')?.valueChanges || of(false)
    ]).subscribe(([installment, recurring]) => {
      this.handleInstallmentRecurrenceConflict(form, installment, recurring);
    });

    // Watcher para expansão automática de seções
    form.valueChanges.subscribe(values => {
      this.autoExpandSections(values);
    });

    // Watcher para estado do formulário
    form.statusChanges.subscribe(() => {
      this.updateState({
        isValid: form.valid,
        isDirty: form.dirty
      });
    });
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
      // Emit warning event or handle conflict
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
