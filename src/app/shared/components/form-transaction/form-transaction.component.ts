import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {Category} from '@app/models/category';
import {TransactionService} from '@app/shared/services/transaction.service';
import {CategoriaService} from '@app/shared/services/category.service';
import {TransactionType} from '@models/transaction-type';
import {RecurrenceType} from '@models/recurrence-type';
import {Transaction} from '@models/transation';
import {FormFieldComponent} from '@shared/components/form-field/form-field.component';
import {FormSelectComponent} from '@shared/components/form-select/form-select.component';
import {CustomButtonComponent} from '@shared/components/custom-buttom/custom-buttom.component';

@Component({
  selector: 'app-form-transaction',
  templateUrl: './form-transaction.component.html',
  styleUrls: ['./form-transaction.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatDialogContent,
    MatDialogTitle,
    FormFieldComponent,
    FormSelectComponent,
    CustomButtonComponent
  ],
  standalone: true
})
export class FormTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  categories: Category[] | null = [];
  isLoading = false;
  isEdit = false;

  // Opções para selects
  transactionTypes: { value: TransactionType; label: string }[] = [
    { value: TransactionType.RECEITA, label: 'Receita' },
    { value:  TransactionType.DESPESA, label: 'Despesa' },
    { value:  TransactionType.TRANSFERENCIA, label: 'Transferência' }
  ];

  recurrenceTypes: { value: RecurrenceType; label: string }[] = [
    { value: 'DIARIO', label: 'Diário' },
    { value: 'SEMANAL', label: 'Semanal' },
    { value: 'QUINZENAL', label: 'Quinzenal' },
    { value: 'MENSAL', label: 'Mensal' },
    { value: 'ANUAL', label: 'Anual' }
  ];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private categoryService: CategoriaService,
    private dialogRef: MatDialogRef<FormTransactionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      category?: Category;
      transaction?: Transaction
    }
  ) {
    this.isEdit = !!this.data?.transaction;
    this.initForm();
  }

  ngOnInit() {
    this.loadCategories();
    if (this.isEdit && this.data?.transaction) {
      this.populateForm(this.data.transaction);
    } else if (this.data?.category) {
      this.transactionForm.patchValue({
        categoryId: this.data.category.id
      });
    }
  }

  private initForm() {
    this.transactionForm = this.fb.group({
      // Campos obrigatórios
      description: ['', [Validators.required, Validators.minLength(3)]],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      type: ['DESPESA', Validators.required],
      date: [new Date(), Validators.required],
      categoryId: [null, Validators.required],

      // Campos opcionais (para futuras implementações)
      observations: [''],

      // Configuração
      paid: [false],
      recurring: [false],
      dueDate: [null],

      // Campos condicionais (aparecem baseado em outros)
      recurrenceType: [null],
      periodicity: [1],
      installment: [false]
    });

    // Watchers para campos condicionais
    this.setupFormWatchers();
  }

  private setupFormWatchers() {
    // Verificar se o campo 'recurring' existe antes de criar o watcher
    const recurringControl = this.transactionForm.get('recurring');

    if (!recurringControl) {
      console.warn('Campo "recurring" não encontrado no formulário');
      return;
    }

    recurringControl.valueChanges.subscribe(isRecurring => {
      const recurrenceTypeControl = this.transactionForm.get('recurrenceType');
      const periodicityControl = this.transactionForm.get('periodicity');
      if (recurrenceTypeControl && periodicityControl) {
        if (isRecurring) {
          recurrenceTypeControl.setValidators([Validators.required]);
          periodicityControl.setValidators([Validators.required, Validators.min(1)]);
        } else {
          recurrenceTypeControl.clearValidators();
          periodicityControl.clearValidators();

          this.transactionForm.patchValue({
            recurrenceType: null,
            periodicity: 1
          }, { emitEvent: false }); // evita loop infinito
        }

        recurrenceTypeControl.updateValueAndValidity();
        periodicityControl.updateValueAndValidity();
      } else {
        console.warn('Campos de recorrência não encontrados no formulário');
      }
    });
  }

  private loadCategories() {
    this.categoryService.findAll().subscribe({
      next: (categories) => {
        this.categories = categories.data;
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    });
  }

  private populateForm(transaction: Transaction) {
    const formValue = {
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: new Date(transaction.date),
      categoryId: transaction.categoryId,
      observations: transaction.observations || '',

      // Configurações (se existirem)
      paid: transaction.configuration?.paid || false,
      recurring: transaction.configuration?.recurring || false,
      recurrenceType: transaction.configuration?.recurrenceType,
      periodicity: transaction.configuration?.periodicity || 1,
      dueDate: transaction.configuration?.dueDate ? new Date(transaction.configuration.dueDate) : null,
      installment: transaction.configuration?.installment || false
    };

    this.transactionForm.patchValue(formValue);
  }

  // Getters para facilitar validação no template
  get description() { return this.transactionForm.get('description'); }
  get amount() { return this.transactionForm.get('amount'); }
  get type() { return this.transactionForm.get('type'); }
  get categoryId() { return this.transactionForm.get('categoryId'); }
  get recurring() { return this.transactionForm.get('recurring'); }

  onSubmit() {
    if (this.transactionForm.valid) {
      this.isLoading = true;

      const formData = this.transactionForm.value;
      const transaction: Transaction = {
        id: this.data?.transaction?.id,
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
          dueDate: formData.dueDate,
          installment: formData.installment
        }
      };

      const request$ = this.isEdit
        ? this.transactionService.updateTransaction(transaction.id!, transaction)
        : this.transactionService.saveTransaction(transaction);

      request$.subscribe({
        next: (result) => {
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Erro ao salvar transação:', error);
          this.isLoading = false;
          // TODO: Mostrar toast de erro
        }
      });
    } else {
      this.transactionForm.markAllAsTouched();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  getCategoryIcon(categoryId: number | string): string {
    if (!this.categories || !categoryId) {
      return 'category';
    }

    const category = this.categories.find(cat =>
      String(cat.id) === String(categoryId)
    );

    return category?.icon || 'category';
  }

  getCategoryColor(categoryId: number | string): string {
    if (!this.categories || !categoryId) {
      return '#666';
    }

    const category = this.categories.find(cat =>
      String(cat.id) === String(categoryId)
    );

    return '#666';
  }
}
