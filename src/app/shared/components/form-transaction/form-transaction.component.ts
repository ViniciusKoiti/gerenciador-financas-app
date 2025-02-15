import { CommonModule } from '@angular/common';
import {Component, Inject, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomButtonComponent } from '../custom-buttom/custom-buttom.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { TransactionType } from '@app/models/transaction-type';
import { Transaction } from '@app/models/transation';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormSelectComponent } from '../form-select/form-select.component';
import {Category} from '@models/category';
import {TransactionService} from '@shared/services/transaction.service';

@Component({
  selector: 'app-form-transaction',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent,
    MatButtonModule,
    FormFieldComponent,
    FormSelectComponent
  ],
  templateUrl: './form-transaction.component.html',
  styleUrl: './form-transaction.component.scss'
})
export class FormTransactionComponent {
  transactionForm!: FormGroup;


  transactionTypes = Object.keys(TransactionType).map((key) => ({
    value: TransactionType[key as keyof typeof TransactionType],
    label: key.charAt(0).toUpperCase() + key.slice(1).toLowerCase(),
  }));

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FormTransactionComponent>,
    private transactionService: TransactionService,
    @Inject(MAT_DIALOG_DATA) public data: {transacition:  Transaction, category: Category}
  ) {}

  ngOnInit(): void {
    const transaction = this.data?.transacition;
    this.transactionForm = this.fb.group({
      id: [transaction?.id ?? null],
      description: [transaction?.description ?? '', [Validators.required]],
      amount: [transaction?.amount ?? 0, [Validators.required, Validators.min(0.01)]],
      type: [transaction?.type ?? '', [Validators.required]],
      date: [transaction?.date ?? '', [Validators.required]],
      categoryId: [this.data?.category?.id ?? null],
    });
  }

  save(): void {
    if (this.transactionForm.invalid) {
      return;
    }

    const transaction = this.transactionForm.value as Transaction;

    this.transactionService.saveTransaction(transaction).subscribe({
      next: (response) => {
        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error("Erro ao criar transação:", error);
      }
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
