
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-field',
  imports: [
      CommonModule, 
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatIconModule,
    ],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() formControl!: FormControl;
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() errors: { [key: string]: string } = {};
  @Input() hidePassword: boolean = false;

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(): string {
    if (!this.formControl.errors) return '';
    
    const firstError = Object.keys(this.formControl.errors)[0];
    return this.errors[firstError] || 'Campo inválido';
  }
}
