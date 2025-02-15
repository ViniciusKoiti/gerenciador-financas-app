
import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {MatError, MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-field',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatError,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true
    }
  ],
  templateUrl: './form-field.component.html',
  styleUrls: ['./form-field.component.scss']
})
export class FormFieldComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() value: any = '';
  @Input() placeholder: string = '';
  @Input() icon: string = '';
  @Input() errors: { [key: string]: string } = {};
  @Input() hidePassword: boolean = true;

  disabled: boolean = false;
  touched: boolean = false;
  onChange: any = () => {};
  onTouched: any = () => {
    this.touched = true;
  };

  onBlur(){
    this.touched = true;
    this.onTouched();
  }
  get currentErrors(): string[] {

    console.log(this.errors);
    if (!this.errors) return [];
    return Object.values(this.errors).filter(error => error);
  }

  togglePassword(): void {
    this.hidePassword = !this.hidePassword;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInputChange(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
  }
}
