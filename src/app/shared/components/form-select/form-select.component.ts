import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
  ],
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss'],
})
export class FormSelectComponent implements ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false; 
  @Input() options: { value: any; label: string }[] = []; 
  @Input() errors: { [key: string]: string } = {};

  value: any; 

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(selectedValue: any): void {
    this.value = selectedValue;
    this.onChange(selectedValue);
    this.onTouched();
  }

  get currentErrors(): string[] {
    if (!this.errors) return [];
    return Object.values(this.errors).filter(error => error);
  }
}
