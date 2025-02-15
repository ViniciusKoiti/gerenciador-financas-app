
import { CommonModule } from '@angular/common';
import {Component, forwardRef, Input, Optional, Self} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule
} from '@angular/forms';
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
  @Input() control!: FormControl;

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
    if (!this.control || !this.control.errors || !this.touched) {
      return [];
    }

    const errors = this.control.errors;
    const messages: string[] = [];
    console.log(errors)
    console.log(this.errors)
    console.log(this.value);
    if (errors['required']) {
      messages.push(this.errors['required'] || 'Este campo é obrigatório.');
      return messages;
    }


    if (errors['minlength']) {
      messages.push(
        this.errors['minlength'] ||
        `O tamanho mínimo é ${errors['minlength'].requiredLength} caracteres. Você digitou ${errors['minlength'].actualLength}.`
      );
      return messages;
    }
    if (errors['maxlength']) {
      messages.push(
        this.errors['maxlength'] ||
        `O tamanho máximo permitido é ${errors['maxlength'].requiredLength} caracteres.`
      );
      return messages;
    }
    if(errors['pattern']){
      messages.push(this.errors['pattern'] || 'Formato inválido.');
      return messages;
    }

    if(errors['email']){
      messages.push(this.errors['email'] || 'Este email é inválido');
      return messages;
    }

    return messages;
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
