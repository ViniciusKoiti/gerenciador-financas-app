// custom-button.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClasses"
      (click)="onClick()"
      [ngClass]="{
        'opacity-50 cursor-not-allowed': disabled,
        'animate-pulse': loading
      }"
    >

      <div *ngIf="loading" class="absolute inset-0 flex items-center justify-center">
        <div class="w-5 h-5 rounded-full animate-spin"></div>
      </div>

      <span *ngIf="icon && !loading" class="d-flex">
        <i class="material-icons text-lg">{{icon}}</i>
      </span>


      <span [class.opacity-0]="loading">
        {{ text }}
      </span>
    </button>
  `,
  styles: [`

  `]
})
export class CustomButtonComponent implements OnInit, OnChanges {
  @Input() text: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() isGradient: boolean = false;
  @Input() customClasses: string = '';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() icon?: string;
  @Input() loading: boolean = false;
  @Input() outline: boolean = false;
  @Output() buttonClick = new EventEmitter<void>();

  buttonClasses: string = '';

  ngOnInit() {
    this.updateButtonClasses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['variant'] || changes['size'] || changes['isGradient'] || changes['customClasses'] || changes['outline']) {
      this.updateButtonClasses();
    }
  }

  private updateButtonClasses(): void {
    const baseClasses = 'relative flex items-center justify-center font-medium transition-all duration-300 rounded-3xl shadow-md hover:shadow-xl focus:outline-none';

    const sizeClasses = {
      'sm': 'h-8 px-4 text-sm',
      'md': 'h-12 px-6 text-base',
      'lg': 'h-14 px-8 text-lg',
      'xl': 'h-16 px-10 text-xl'
    }[this.size];

    const variantClasses = this.outline
      ? this.getOutlineVariantClasses()
      : this.getSolidVariantClasses();

    const gradientClasses = this.isGradient ? this.getGradientClasses() : '';

    const effectClasses = 'hover:transform hover:scale-105 active:scale-100';

    this.buttonClasses = `
      ${baseClasses}
      ${sizeClasses}
      ${variantClasses}
      ${gradientClasses}
      ${effectClasses}
      ${this.customClasses}
    `.trim().replace(/\s+/g, ' ');
  }

  private getSolidVariantClasses(): string {
    const variants = {
      'primary': 'bg-yellow-500 text-white hover:bg-yellow-600 hover:text-white',
      'secondary': 'bg-gray-600 text-white hover:bg-gray-700 hover:text-white',
      'danger': 'bg-red-600 text-white hover:bg-red-700 hover:text-white',
      'success': 'bg-green-600 text-white hover:bg-green-700 ',
      'warning': 'bg-yellow-500 text-white hover:bg-yellow-600 '
    };
    return variants[this.variant];
  }

  private getOutlineVariantClasses(): string {
    const variants = {
      'primary': 'border-2 border-yellow-600 text-blue-600 hover:bg-yellow-50 ',
      'secondary': 'border-2 border-gray-600 text-gray-600 hover:bg-gray-50 ',
      'danger': 'border-2 border-red-600 text-red-600 hover:bg-red-50 ',
      'success': 'border-2 border-green-600 text-green-600 hover:bg-green-50 ',
      'warning': 'border-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50 '
    };
    return variants[this.variant];
  }

  private getGradientClasses(): string {
    const gradients = {
      'primary': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'secondary': 'bg-gradient-to-r from-gray-500 to-gray-600',
      'danger': 'bg-gradient-to-r from-red-500 to-red-600',
      'success': 'bg-gradient-to-r from-green-500 to-green-600',
      'warning': 'bg-gradient-to-r from-yellow-400 to-yellow-500'
    };
    return gradients[this.variant];
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
