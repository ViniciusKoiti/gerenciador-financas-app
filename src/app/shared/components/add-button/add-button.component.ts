import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-add-button',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule
  ],
  template: `
    <button
      mat-mini-fab
      color="primary"
      [matTooltip]="tooltip"
      class="!bg-white !shadow-md hover:!bg-gray-200"
      (click)="onClick()">
      <mat-icon class="text-gray-600">add</mat-icon>
    </button>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
  `]
})
export class AddButtonComponent {
  @Input() tooltip: string = 'Adicionar';
  @Output() addClick = new EventEmitter<void>();

  onClick() {
    this.addClick.emit();
  }
}
