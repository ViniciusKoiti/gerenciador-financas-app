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
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {combineLatest, of} from 'rxjs';

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
  standalone: true
})
export class FormTransactionComponent implements OnInit {
  transactionForm!: FormGroup;
  categories: Category[] = [];
  isLoading = false;
  isEdit = false;

  // Controle de seções expansíveis
  showAdvancedOptions = false;
  showRecurrenceOptions = false;

  // Opções para selects
  transactionTypes: { value: TransactionType; label: string }[] = [
    { value: TransactionType.RECEITA, label: '💰 Receita' },
    { value: TransactionType.DESPESA, label: '💸 Despesa' },
    { value: TransactionType.TRANSFERENCIA, label: '🔄 Transferência' }
  ];

  recurrenceTypes: { value: RecurrenceType; label: string }[] = [
    { value: 'DIARIO', label: '📅 Diário' },
    { value: 'SEMANAL', label: '📆 Semanal' },
    { value: 'QUINZENAL', label: '🗓️ Quinzenal' },
    { value: 'MENSAL', label: '📊 Mensal' },
    { value: 'ANUAL', label: '🎯 Anual' }
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
    this.setupFormWatchers();

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
      type: [TransactionType.DESPESA, Validators.required],
      date: [new Date(), Validators.required],
      categoryId: [null, Validators.required],

      // Campos opcionais
      observations: [''],

      // Configuração básica
      paid: [false],
      dueDate: [null],
      installment: [false],

      // Recorrência
      recurring: [false],
      recurrenceType: [null],
      periodicity: [1],

      // Controles de orçamento
      ignorarLimiteCategoria: [false],
      ignorarOrcamento: [false]
    });
  }

  private setupFormWatchers() {
    // Watcher para recorrência
    this.transactionForm.get('recurring')?.valueChanges.subscribe(isRecurring => {
      const recurrenceTypeControl = this.transactionForm.get('recurrenceType');
      const periodicityControl = this.transactionForm.get('periodicity');

      if (isRecurring) {
        recurrenceTypeControl?.setValidators([Validators.required]);
        periodicityControl?.setValidators([Validators.required, Validators.min(1)]);
        this.showRecurrenceOptions = true;
      } else {
        recurrenceTypeControl?.clearValidators();
        periodicityControl?.clearValidators();
        this.transactionForm.patchValue({
          recurrenceType: null,
          periodicity: 1
        }, { emitEvent: false });
      }

      recurrenceTypeControl?.updateValueAndValidity();
      periodicityControl?.updateValueAndValidity();
    });

    // Watcher para parcelamento + recorrência (não pode ter ambos)
    combineLatest([
      this.transactionForm.get('installment')?.valueChanges || of(false),
      this.transactionForm.get('recurring')?.valueChanges || of(false)
    ]).subscribe(([installment, recurring]) => {
      if (installment && recurring) {
        // Mostrar aviso e desativar parcelamento
        this.showWarning('Transação não pode ser parcelada e recorrente ao mesmo tempo');
        this.transactionForm.patchValue({ installment: false }, { emitEvent: false });
      }
    });

    // Expandir seções automaticamente baseado nos valores
    this.transactionForm.valueChanges.subscribe(values => {
      this.autoExpandSections(values);
    });
  }

  private autoExpandSections(values: any) {
    // Expandir configurações avançadas se houver dados
    if (values.observations || values.paid || values.dueDate || values.installment) {
      this.showAdvancedOptions = true;
    }

    // Expandir recorrência se ativa
    if (values.recurring) {
      this.showRecurrenceOptions = true;
    }
  }

  private loadCategories() {
    this.categoryService.findAll().subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error: Error) => {
        console.error('Erro ao carregar categorias:', error);
        this.showError('Erro ao carregar categorias');
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

      paid: transaction.configuration?.paid || false,
      recurring: transaction.configuration?.recurring || false,
      recurrenceType: transaction.configuration?.recurrenceType,
      periodicity: transaction.configuration?.periodicity || 1,
      dueDate: transaction.configuration?.dueDate ? new Date(transaction.configuration.dueDate) : null,
      installment: transaction.configuration?.installment || false,
      // ignorarLimiteCategoria: false,
      // ignorarOrcamento: false
    };

    this.transactionForm.patchValue(formValue);
  }

  // Getters para opções de select
  get categoryOptions(): { value: number; label: string }[] {
    return this.categories.map(cat => ({
      value: cat.id,
      label: `${cat.icon || '📁'} ${cat.name}`
    }));
  }

  // Métodos para o template
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  }

  getCategoryName(): string {
    const categoryId = this.transactionForm.get('categoryId')?.value;
    const category = this.categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  }

  getRecurrencePreview(): string {
    const recurring = this.transactionForm.get('recurring')?.value;
    if (!recurring) return '';

    const type = this.transactionForm.get('recurrenceType')?.value;
    const periodicity = this.transactionForm.get('periodicity')?.value || 1;

    const typeLabels: { [key: string]: string } = {
      'DIARIO': 'dia(s)',
      'SEMANAL': 'semana(s)',
      'QUINZENAL': 'quinzena(s)',
      'MENSAL': 'mês(es)',
      'ANUAL': 'ano(s)'
    };

    if (type && typeLabels[type]) {
      return `Repetir a cada ${periodicity} ${typeLabels[type]}`;
    }

    return 'Configure o tipo de recorrência';
  }

  // Métodos de ação
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
          installment: formData.installment,
          // ignorarLimiteCategoria: formData.ignorarLimiteCategoria,
          // ignorarOrcamento: formData.ignorarOrcamento
        }
      };

      const request$ = this.isEdit
        ? this.transactionService.updateTransaction(transaction.id!, transaction)
        : this.transactionService.saveTransaction(transaction);

      request$.subscribe({
        next: (response) => {
          this.showSuccess(this.isEdit ? 'Transação atualizada!' : 'Transação criada!');
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Erro ao salvar transação:', error);
          this.showError('Erro ao salvar transação');
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
      this.showError('Preencha todos os campos obrigatórios');
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  // Métodos utilitários
  private markFormGroupTouched() {
    Object.keys(this.transactionForm.controls).forEach(field => {
      const control = this.transactionForm.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  private showSuccess(message: string) {
    // Implementar notificação de sucesso
    console.log('✅', message);
  }

  private showError(message: string) {
    // Implementar notificação de erro
    console.error('❌', message);
  }

  private showWarning(message: string) {
    // Implementar notificação de aviso
    console.warn('⚠️', message);
  }

  // Getters para validação
  get description() { return this.transactionForm.get('description'); }
  get amount() { return this.transactionForm.get('amount'); }
  get type() { return this.transactionForm.get('type'); }
  get categoryId() { return this.transactionForm.get('categoryId'); }
  get recurring() { return this.transactionForm.get('recurring'); }
}
