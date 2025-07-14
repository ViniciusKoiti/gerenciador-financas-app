import { Component, Inject, OnInit, DestroyRef, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Observable, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotificationService } from '@shared/services/notification.service';
import { TransactionService } from '@shared/services/transaction.service';
import { FormFieldComponent } from '@shared/components/form-field/form-field.component';
import { FormSelectComponent } from '@shared/components/form-select/form-select.component';
import { CustomButtonComponent } from '@shared/components/custom-buttom/custom-buttom.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {SelectOption, TransactionFormOptions} from '@models/form-options.model';
import { FormTransactionService } from '@shared/components/form-transaction/services/form-transaction.service';
import { FormTransactionValidationService } from '@shared/components/form-transaction/services/form-transaction-validation.service';
import { FormStateTransactionManagerService } from '@shared/components/form-transaction/services/form-state-manager-transaction.services';
import { FormTransactionDialogData } from '@models/form-dialog-data.model';
import { Category } from '@models/category';
import { TransactionFormData } from '@models/form-transaction.models';
import {RECURRENCE_TYPES, TRANSACTION_TYPES} from '@shared/components/form-transaction/form-transaction.constants';
import {TransactionType} from '@models/transaction-type';
import {RecurrenceType} from '@models/recurrence-type';

@Component({
  selector: 'app-form-transaction',
  templateUrl: './form-transaction.component.html',
  styleUrls: ['./form-transaction.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogTitle,
    MatExpansionModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    FormFieldComponent,
    FormSelectComponent,
    CustomButtonComponent
  ],
  providers: [
    {
      provide: FormStateTransactionManagerService,
      useClass: FormStateTransactionManagerService
    }],
  standalone: true
})
export class FormTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  options$!: Observable<TransactionFormOptions>;

  isEdit = false;
  isLoading = false;
  showAdvancedOptions = false;
  showRecurrenceOptions = false;

  transactionTypes: SelectOption<TransactionType>[] = [];
  recurrenceTypes: SelectOption<RecurrenceType>[] = [];
  categories: SelectOption<number>[] = [];

  private formTransactionService = inject(FormTransactionService);
  private formValidationService = inject(FormTransactionValidationService);
  private notificationService = inject(NotificationService);
  private transactionService = inject(TransactionService);
  private destroyRef = inject(DestroyRef);

  constructor(
    private formStateService: FormStateTransactionManagerService,
    private dialogRef: MatDialogRef<FormTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FormTransactionDialogData
  ) {
    this.isEdit = !!this.data?.transaction;
    this.formStateService.setEditMode(this.isEdit);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadOptions();
    this.setupFormWatchers();
    this.setupStateWatchers();
    this.populateFormIfEdit();
  }

  private initializeForm(): void {
    this.transactionForm = this.formTransactionService.createTransactionForm();
  }

  private loadOptions(): void {
    this.options$ = this.formTransactionService.getFormOptions();

    this.options$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(options => {
        this.transactionTypes = options.transactionTypes;
        this.recurrenceTypes = options.recurrenceTypes;
        this.categories = options.categories || [];
      });
  }

  private setupFormWatchers(): void {
    this.formStateService.setupFormWatchers(this.transactionForm);
  }

  private setupStateWatchers(): void {
    this.formStateService.state$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(state => {
        this.isLoading = state.isLoading;
        this.showAdvancedOptions = state.showAdvancedOptions;
        this.showRecurrenceOptions = state.showRecurrenceOptions;
      });
  }
  private populateFormIfEdit(): void {
    if (this.formStateService.currentState.isEdit && this.data?.transaction) {
      this.formTransactionService.populateFormWithTransaction(
        this.transactionForm,
        this.data.transaction
      );
    } else if (this.data?.category) {
      this.transactionForm.patchValue({
        categoryId: this.data.category.id
      });
    }
  }
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }

  getCategoryName(): string {
    const categoryId = this.transactionForm.get('categoryId')?.value;
    if (!categoryId || !this.categories.length) return '';

    const category = this.categories.find(cat => cat.value  === categoryId);
    return category ? category.label : '';
  }
  getCategoryNameById(categoryId: number, categories: Category[]): string {
    return this.formValidationService.getCategoryName(categoryId, categories);
  }
  getRecurrencePreview(): string {
    const formValue = this.transactionForm.value;
    return this.formValidationService.getRecurrencePreview(
      formValue.recurring,
      formValue.recurrenceType,
      formValue.periodicity
    );
  }
  get categoryOptions() {
    return this.categories;
  }

  onSubmit(): void {
    const validationResult = this.formValidationService.validateForm(this.transactionForm);

    if (!validationResult.isValid) {
      this.formValidationService.markFormGroupTouched(this.transactionForm);
      this.notificationService.showError('Preencha todos os campos obrigatórios');
      return;
    }

    this.saveTransaction();
  }
  private saveTransaction(): void {
    this.formStateService.setLoading(true);

    const formData: TransactionFormData = this.transactionForm.value;
    const transaction = this.formTransactionService.transformFormDataToTransaction(
      formData,
      this.data?.transaction?.id
    );

    const request$ = this.formStateService.currentState.isEdit
      ? this.transactionService.updateTransaction(transaction.id!, transaction)
      : this.transactionService.saveTransaction(transaction);

    request$
      .pipe(
        finalize(() => this.formStateService.setLoading(false)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (response) => {
          const message = this.formStateService.currentState.isEdit
            ? 'Transação atualizada!'
            : 'Transação criada!';
          this.notificationService.showSuccess(message);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Erro ao salvar transação:', error);
          this.notificationService.showError('Erro ao salvar transação');
        }
      });
  }
  onCancel(): void {
    this.dialogRef.close();
  }
  get description() { return this.transactionForm.get('description'); }
  get amount() { return this.transactionForm.get('amount'); }
  get type() { return this.transactionForm.get('type'); }
  get categoryId() { return this.transactionForm.get('categoryId'); }
  get recurring() { return this.transactionForm.get('recurring'); }
}
