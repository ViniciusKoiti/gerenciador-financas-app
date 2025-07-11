import {Injectable} from '@angular/core';
import {Category} from '@models/category';
import {TransactionType} from '@models/transaction-type';


export interface FinancialSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldoTotal: number;
}

export interface CategoryTotals {
  name: string;
  receitas: number;
  despesas: number;
  saldo: number;
  transactionCount: number;
}

export interface TemporalData {
  periodo: string;
  receitas: number;
  despesas: number;
  saldo: number;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialDataService {

  calculateFinancialSummary(categories: Category[]): FinancialSummary {
    let totalReceitas = 0;
    let totalDespesas = 0;

    categories.forEach(category => {
      category.transactions?.forEach(transaction => {
        if (transaction.type === TransactionType.RECEITA) {
          totalReceitas += transaction.amount;
        } else if (transaction.type === TransactionType.DESPESA) {
          totalDespesas += Math.abs(transaction.amount);
        }
      });
    });

    return {
      totalReceitas,
      totalDespesas,
      saldoTotal: totalReceitas - totalDespesas
    };
  }
  calculateCategoryTotals(categories: Category[]): CategoryTotals[] {
    return categories.map(category => {
      let receitas = 0;
      let despesas = 0;
      let transactionCount = 0;

      category.transactions?.forEach(transaction => {
        transactionCount++;
        if (transaction.type === TransactionType.RECEITA) {
          receitas += transaction.amount;
        } else if (transaction.type === TransactionType.DESPESA) {
          despesas += Math.abs(transaction.amount);
        }
      });

      return {
        name: category.name,
        receitas,
        despesas,
        saldo: receitas - despesas,
        transactionCount
      };
    });
  }

  calculateTemporalData(categories: Category[]): TemporalData[] {
    const now = new Date();
    const monthsData: TemporalData[] = [];

    // Gerar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleString('pt-BR', { month: 'short', year: '2-digit' });

      let receitas = 0;
      let despesas = 0;

      categories.forEach(category => {
        category.transactions?.forEach(transaction => {
          const transactionDate = new Date(transaction.date);

          if (transactionDate.getMonth() === date.getMonth() &&
            transactionDate.getFullYear() === date.getFullYear()) {

            if (transaction.type === TransactionType.RECEITA) {
              receitas += transaction.amount;
            } else if (transaction.type === TransactionType.DESPESA) {
              despesas += Math.abs(transaction.amount);
            }
          }
        });
      });

      monthsData.push({
        periodo: monthKey,
        receitas,
        despesas,
        saldo: receitas - despesas
      });
    }

    return monthsData;
  }

  getCategoriesWithBalance(categoryTotals: CategoryTotals[]): CategoryTotals[] {
    return categoryTotals.filter(cat => Math.abs(cat.saldo) > 0);
  }

  getCategoriesWithExpenses(categoryTotals: CategoryTotals[]): CategoryTotals[] {
    return categoryTotals.filter(cat => cat.despesas > 0);
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
}


