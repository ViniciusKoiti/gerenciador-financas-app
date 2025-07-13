// custom-button.component.ts - VERSÃO COM TEMA AMARELO
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick()"
      [ngClass]="{
        'opacity-60 cursor-not-allowed': disabled || loading,
        'transform scale-95': loading
      }"
    >
      <!-- Loading Spinner -->
      <div *ngIf="loading" class="absolute inset-0 flex items-center justify-center">
        <div class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      </div>

      <!-- Ícone -->
      <span *ngIf="icon && !loading" class="flex items-center mr-2">
        <i class="material-icons text-lg">{{icon}}</i>
      </span>

      <!-- Texto do botão -->
      <span [class.opacity-0]="loading" class="font-medium">
        {{ loading ? loadingText : text }}
      </span>

      <!-- Indicador de sucesso (opcional) -->
      <span *ngIf="showSuccess && !loading" class="ml-2 flex items-center">
        <i class="material-icons text-lg">check_circle</i>
      </span>
    </button>
  `,
  styles: [`
    button {
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    /* Efeito shimmer/brilho */
    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      transition: left 0.6s;
    }

    button:hover::before {
      left: 100%;
    }

    button:active {
      transform: scale(0.98);
    }

    button.primary-glow {
      box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
    }

    button.primary-glow:hover {
      box-shadow: 0 0 30px rgba(255, 193, 7, 0.5);
    }
  `]
})
export class CustomButtonComponent implements OnInit, OnChanges {
  @Input() text: string = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled: boolean = false;
  @Input() isGradient: boolean = false;
  @Input() customClasses: string = '';
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() icon?: string;
  @Input() loading: boolean = false;
  @Input() loadingText: string = 'Carregando...';
  @Input() outline: boolean = false;
  @Input() showSuccess: boolean = false;
  @Input() fullWidth: boolean = false;
  @Input() glowEffect: boolean = false; // Novo: efeito de brilho
  @Output() buttonClick = new EventEmitter<void>();

  buttonClasses: string = '';

  ngOnInit() {
    this.updateButtonClasses();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['variant'] || changes['size'] || changes['isGradient'] ||
      changes['customClasses'] || changes['outline'] || changes['fullWidth'] || changes['glowEffect']) {
      this.updateButtonClasses();
    }
  }

  private updateButtonClasses(): void {
    const baseClasses = 'relative flex items-center justify-center font-medium transition-all duration-300 rounded-3xl shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2';

    const sizeClasses = {
      'sm': 'h-9 px-4 text-sm gap-1',
      'md': 'h-12 px-6 text-base gap-2',
      'lg': 'h-14 px-8 text-lg gap-2',
      'xl': 'h-16 px-10 text-xl gap-3'
    }[this.size];

    const variantClasses = this.outline
      ? this.getOutlineVariantClasses()
      : this.getSolidVariantClasses();

    const gradientClasses = this.isGradient ? this.getGradientClasses() : '';

    const widthClasses = this.fullWidth ? 'w-full' : '';

    const effectClasses = 'hover:transform hover:scale-105 active:scale-100 disabled:hover:scale-100';

    const glowClasses = this.glowEffect && this.variant === 'primary' ? 'primary-glow' : '';

    this.buttonClasses = `
      ${baseClasses}
      ${sizeClasses}
      ${variantClasses}
      ${gradientClasses}
      ${effectClasses}
      ${widthClasses}
      ${glowClasses}
      ${this.customClasses}
    `.trim().replace(/\s+/g, ' ');
  }

  private getSolidVariantClasses(): string {
    const variants = {
      'primary': 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 hover:text-white',

      'light': 'bg-white text-yellow-600 hover:bg-gray-50 focus:ring-yellow-500 border border-yellow-200',

      'secondary': 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',

      // Estados específicos
      'danger': 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
      'success': 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-500',
      'warning': 'bg-orange-500 text-white hover:bg-orange-600 focus:ring-orange-500',
      'info': 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500'
    };
    return variants[this.variant];
  }

  private getOutlineVariantClasses(): string {
    const variants = {
      'primary': 'border-2 border-yellow-600 text-yellow-700 hover:bg-yellow-50 focus:ring-yellow-500',

      'light': 'border-2 border-white text-white hover:bg-white hover:bg-opacity-20 focus:ring-white',

      'secondary': 'border-2 border-gray-500 text-gray-600 hover:bg-gray-50 focus:ring-gray-500',
      'danger': 'border-2 border-red-500 text-red-600 hover:bg-red-50 focus:ring-red-500',
      'success': 'border-2 border-green-500 text-green-600 hover:bg-green-50 focus:ring-green-500',
      'warning': 'border-2 border-orange-500 text-orange-600 hover:bg-orange-50 focus:ring-orange-500',
      'info': 'border-2 border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-500'
    };
    return variants[this.variant];
  }

  private getGradientClasses(): string {
    const gradients = {
      'primary': 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-500 hover:to-yellow-600',

      'light': 'bg-gradient-to-r from-white to-yellow-50 hover:from-yellow-50 hover:to-yellow-100',

      'secondary': 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700',
      'danger': 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      'success': 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      'warning': 'bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600',
      'info': 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
    };
    return gradients[this.variant];
  }

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit();
    }
  }
}
