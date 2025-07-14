import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import {FormValidationErrors, FormValidationResult} from '@models/form-validation.model';
import {
  FORM_VALIDATION_MESSAGES,
  RECURRENCE_TYPE_LABELS
} from '@shared/components/form-transaction/form-transaction.constants';
import {Category} from '@models/category';
import {RecurrenceType} from '@models/recurrence-type';


@Injectable({
  providedIn: 'root'
})
export class FormTransactionValidationService {

  validateForm(form: FormGroup): FormValidationResult {
    const errors: FormValidationErrors = {};
    let isValid = true;

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      if (control && control.errors) {
        isValid = false;
        errors[key] = this.getErrorMessage(control);
      }
    });

    return { isValid, errors };
  }

  private getErrorMessage(control: AbstractControl): string {
    const errors = control.errors;
    if (!errors) return '';

    if (errors['required']) return FORM_VALIDATION_MESSAGES.required;
    if (errors['minlength']) return FORM_VALIDATION_MESSAGES.minlength.replace('{requiredLength}', errors['minlength'].requiredLength);
    if (errors['min']) return FORM_VALIDATION_MESSAGES.min.replace('{min}', errors['min'].min);
    if (errors['email']) return FORM_VALIDATION_MESSAGES.email;

    return 'Campo inválido';
  }

  markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  getCategoryName(categoryId: number, categories: Category[]): string {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  getRecurrencePreview(recurring: boolean, recurrenceType: RecurrenceType, periodicity: number): string {
    if (!recurring) return '';

    if (recurrenceType && RECURRENCE_TYPE_LABELS[recurrenceType]) {
      return `Repetir a cada ${periodicity} ${RECURRENCE_TYPE_LABELS[recurrenceType]}`;
    }

    return 'Configure o tipo de recorrência';
  }
}
