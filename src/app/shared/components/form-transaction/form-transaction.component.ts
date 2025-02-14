import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CustomButtonComponent } from '../custom-buttom/custom-buttom.component';
import { FormFieldComponent } from '../form-field/form-field.component';
import { TransactionType } from '@app/models/transaction-type';
import { Transaction } from '@app/models/transation';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FormSelectComponent } from '../form-select/form-select.component';

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
    @Inject(MAT_DIALOG_DATA) public data: Transaction
  ) {}

  ngOnInit(): void {
    this.transactionForm = this.fb.group({
      description: [this.data?.description || '', [Validators.required]],
      amount: [this.data?.amount || 0, [Validators.required, Validators.min(0.01)]],
      type: [this.data?.type || '', [Validators.required]],
      date: [this.data?.date || '', [Validators.required]],
    });
  }

  save(): void {
    if (this.transactionForm.valid) {
      this.dialogRef.close(this.transactionForm.value); 
    }
    
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
