import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';
import { TransactionType } from '@app/models/transaction-type';
import { Transaction } from '@app/models/transation';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {TransactionService} from '@shared/services/transaction.service';
import {MatIcon} from '@angular/material/icon';

export interface Category {
  name: string;
  transactions: Transaction[];
}

interface Totals {
  expenses: number;
  income: number;
  balance: number;
  count: number;
}

@Component({
  selector: 'app-transaction-totalizator',
  standalone: true,
  imports: [CommonModule, MatExpansionPanel, MatExpansionPanelHeader, MatAccordion, MatIcon],
  templateUrl: './transaction-totalizator.component.html',
  styleUrls: ['./transaction-totalizator.component.scss']
})
export class TransactionTotalizatorComponent implements OnChanges, OnChanges {
  @Input() categories: Category[] = [];
  generalTotals: Totals = { expenses: 0, income: 0, balance: 0, count: 0 };
  categoryTotals: { [categoryName: string]: Totals } = {};

  ngOnChanges(): void {
    this.calculateTotals();
  }

  private calculateTotals(): void {
    this.categoryTotals = {};
    this.generalTotals = { expenses: 0, income: 0, balance: 0, count: 0 };
    if(!this.categories) return;
    this.categories.forEach(category => {
      if(!category) return;
      if(!category.transactions) return;

      const totals: Totals = { expenses: 0, income: 0, balance: 0, count: 0 };

      category.transactions.forEach(transaction => {
        if (transaction.type === TransactionType.RECEITA) {
          totals.income += transaction.amount;
        } else {
          totals.expenses += transaction.amount;
        }
        totals.count++;
      });

      totals.balance = totals.income - totals.expenses;
      this.categoryTotals[category.name] = totals;

      this.generalTotals.income += totals.income;
      this.generalTotals.expenses += totals.expenses;
      this.generalTotals.count += totals.count;
    });

    this.generalTotals.balance = this.generalTotals.income - this.generalTotals.expenses;
  }

  formatCurrency(value: number | undefined): string  {
    if(value === undefined){
      return "0.00"
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getBalanceClass(balance: number | undefined): string {
    return balance !== undefined && balance >= 0 ? 'text-green-600' : 'text-red-600';
  }
}
