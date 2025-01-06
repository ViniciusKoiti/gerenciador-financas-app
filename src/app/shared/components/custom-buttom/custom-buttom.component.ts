// custom-button.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: true,  
  imports: [        
    CommonModule
  ],
  template: `
    <button 
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="onClick()">
      <span>
        {{ text }}
      </span>
    </button>
  `
})
export class CustomButtonComponent implements OnInit, OnChanges {
  @Input() text: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() isGradient: boolean = false;
  @Input() customClasses: string = '';
  @Output() buttonClick = new EventEmitter<void>();

  buttonClasses: string = '';

  ngOnInit() {
    this.updateButtonClasses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isGradient'] || changes['customClasses']) {
      this.updateButtonClasses();
    }
  }

  private updateButtonClasses(): void {
    const baseClasses = 'h-12 transition-all duration-300 rounded-3xl shadow-md hover:shadow-xl';
    const gradientClasses = this.isGradient ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white hover:bg-white' : '';
    this.buttonClasses = `${baseClasses} ${gradientClasses} ${this.customClasses}`.trim();
  }

  onClick(): void {
    if (!this.disabled) {
      this.buttonClick.emit();
    }
  }
}