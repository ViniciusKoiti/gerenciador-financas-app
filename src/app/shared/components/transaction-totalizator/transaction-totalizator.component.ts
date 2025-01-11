import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TransactionType } from '@app/models/transaction-type';
import { Transaction } from '@app/models/transation';


interface ColumnTotal {
  expenses: number;
  income: number;
  balance: number;
  count: number;
}

interface BoardTotals {
  [key: string]: ColumnTotal;
}


@Component({
  selector: 'app-transaction-totalizator',
  imports: [
    CommonModule
  ],
  templateUrl: './transaction-totalizator.component.html',
  styleUrl: './transaction-totalizator.component.scss'
})
export class TransactionTotalizatorComponent {
  @Input() columns!: {
    [key: string]: {
      id: string;
      title: string;
      items: Transaction[];
    };
  };

  generalTotals: ColumnTotal = {} as ColumnTotal;

  totals: BoardTotals = {} as BoardTotals;

  ngOnChanges() {
    this.calculateTotals();
  }

  private calculateTotals() {
    this.totals = {
      toBePaid: this.initializeColumnTotal(),
      intended: this.initializeColumnTotal(),
      deadline: this.initializeColumnTotal(),
      paid: this.initializeColumnTotal(),
    };

    Object.entries(this.columns).forEach(([key, column]) => {
      column.items.forEach(transaction => {
        this.addTransactionToTotal(transaction, key);
      });

      this.totals[key].count = column.items.length;
    });

    this.generalTotals = this.initializeColumnTotal();

    Object.values(this.totals).forEach(columnTotal => {
      this.generalTotals.expenses += columnTotal.expenses;
      this.generalTotals.income += columnTotal.income;
      this.generalTotals.count += columnTotal.count;
    });

    this.generalTotals.balance = this.generalTotals.income - this.generalTotals.expenses;
    
    
  }

  private initializeColumnTotal(): ColumnTotal {
    return {
      expenses: 0,
      income: 0,
      balance: 0,
      count: 0
    };
  }

  private addTransactionToTotal(transaction: Transaction, totalKey: string) {
    if (transaction.type === TransactionType.RECEITA) {
      this.totals[totalKey].income += transaction.amount;
    } else {
      this.totals[totalKey].expenses += transaction.amount;
    }
    this.totals[totalKey].balance = this.totals[totalKey].income - this.totals[totalKey].expenses;
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getColumnTitle(key: string): string {
    if (key === 'general') return 'Total Geral';
    return this.columns[key]?.title || '';
  }

  getBackgroundClass(key: string): string {
    switch (key) {
      case 'toBePaid': return 'bg-red-50';
      case 'intended': return 'bg-yellow-50';
      case 'deadline': return 'bg-blue-50';
      case 'paid': return 'bg-green-50';
      case 'general': return 'bg-gray-50';
      default: return 'bg-white';
    }
  }

  getBalanceClass(balance: number): string {
    return balance >= 0 ? 'text-green-600' : 'text-red-600';
  }
}
