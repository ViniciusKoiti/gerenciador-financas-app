import { Component, Input } from '@angular/core';
import {CdkDrag} from '@angular/cdk/drag-drop';
import {DatePipe, NgClass} from '@angular/common';
import {Transaction} from '@models/transation';

@Component({
  selector: 'app-transaction-item',
  templateUrl: './transaction-item.component.html',
  styleUrls: ['./transaction-item.component.scss'],
  imports: [
    CdkDrag,
    NgClass,
    DatePipe
  ],
  standalone: true
})
export class TransactionItemComponent {
  @Input() transaction!: Transaction;

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}
