import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {CustomButtonComponent} from '@shared/components/custom-buttom/custom-buttom.component';
import {MatButtonModule} from '@angular/material/button';
import {FormFieldComponent} from '@shared/components/form-field/form-field.component';
import {FormSelectComponent} from '@shared/components/form-select/form-select.component';
import {MatSlideToggle} from '@angular/material/slide-toggle';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    CustomButtonComponent,
    MatButtonModule,
    FormFieldComponent,
    FormSelectComponent,
    MatSlideToggle,
    MatIcon
  ],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;

  iconOptions = [
    { value: 'account_balance', label: 'Financeiro' },
    { value: 'shopping_cart', label: 'Compras' },
    { value: 'home', label: 'Casa' },
    { value: 'directions_car', label: 'Transporte' },
    { value: 'restaurant', label: 'Alimentação' },
    { value: 'favorite', label: 'Pessoal' },
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryFormComponent>
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      icon: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
  }

  save(): void {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      this.dialogRef.close(formValue);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
