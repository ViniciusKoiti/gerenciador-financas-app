import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map } from 'rxjs';
import { Transaction } from '@models/transation';
import {CategoriaService} from '@shared/services/category.service';
import {
  FORM_DEFAULTS,
  RECURRENCE_TYPES,
  TRANSACTION_TYPES
} from '@shared/components/form-transaction/form-transaction.constants';
import {TransactionFormOptions} from '@models/form-options.model';
import {TransactionFormData} from '@models/form-transaction.models';

@Injectable({
  providedIn: 'root'
})
export class FormTransactionService {

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoriaService
  ) {}

  createTransactionForm(): FormGroup {
    return this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: [FORM_DEFAULTS.amount, [Validators.required, Validators.min(0.01)]],
      type: [FORM_DEFAULTS.type, Validators.required],
      date: [FORM_DEFAULTS.date, Validators.required],
      categoryId: [null, Validators.required],
      observations: [''],
      paid: [FORM_DEFAULTS.paid],
      paymentDate: [null],
      dueDate: [null],
      installment: [FORM_DEFAULTS.installment],
      recurring: [FORM_DEFAULTS.recurring],
      recurrenceType: [null],
      periodicity: [FORM_DEFAULTS.periodicity],
      ignoreCategoryLimit: [FORM_DEFAULTS.ignoreCategoryLimit || false],
      ignoreBudget: [FORM_DEFAULTS.ignoreBudget || false]
    });
  }

  getFormOptions(): Observable<TransactionFormOptions> {
    return this.categoryService.findByUsuarioId(1).pipe(
      map(categories => ({
        transactionTypes: TRANSACTION_TYPES,
        recurrenceTypes: RECURRENCE_TYPES,
        categories: (categories || []).map(cat => ({
          value: cat.id,
          label: `${cat.icon || '📁'} ${cat.name}`
        }))
      }))
    );
  }
  populateFormWithTransaction(form: FormGroup, transaction: Transaction): void {
    const formValue : TransactionFormData = {
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: new Date(transaction.date),
      categoryId: transaction.categoryId,
      observations: transaction.observations || '',
      paid: transaction.configuration?.paid || false,
      recurring: transaction.configuration?.recurring || false,
      recurrenceType: transaction.configuration?.recurrenceType,
      periodicity: transaction.configuration?.periodicity || 1,
      dueDate: transaction.configuration?.dueDate ? new Date(transaction.configuration.dueDate) : undefined,
      paymentDate: transaction.configuration?.paymentDate ? new Date(transaction.configuration.paymentDate) : undefined,
      installment: transaction.configuration?.installment || false,
      ignoreBudget: transaction.configuration?.ignoreBudget || false,
      ignoreCategoryLimit: transaction.configuration?.ignoreCategoryLimit || false
    };

    form.patchValue(formValue);
  }

  transformFormDataToTransaction(formData: TransactionFormData, transactionId?: number): Transaction {
    return {
      id: transactionId,
      description: formData.description,
      amount: formData.amount,
      type: formData.type,
      date: formData.date,
      categoryId: formData.categoryId,
      observations: formData.observations,
      configuration: {
        paid: formData.paid,
        recurring: formData.recurring,
        recurrenceType: formData.recurrenceType,
        periodicity: formData.periodicity,
        paymentDate: formData.paymentDate,
        dueDate: formData.dueDate,
        installment: formData.installment,
      }
    };
  }


}
