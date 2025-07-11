

import { Injectable } from '@angular/core';
import { ChartData, ChartConfiguration } from 'chart.js';

export interface FinancialSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldoTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class ChartDataService {

  constructor() { }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  getDefaultBarOptions(): ChartConfiguration<'bar'>['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 13 }, padding: 20 }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Valor (R$)' }
        }
      }
    };
  }

  getDefaultPieOptions(): ChartConfiguration<'pie'>['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 12 }, padding: 15 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = this.formatCurrency(context.parsed as number);
              const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed as number / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    };
  }

  getDefaultLineOptions(): ChartConfiguration<'line'>['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          position: 'top',
          labels: { font: { size: 12 }, padding: 20 }
        }
      },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Valor (R$)' } },
        x: { title: { display: true, text: 'Período' } }
      }
    };
  }

  getDefaultDoughnutOptions(): ChartConfiguration<'doughnut'>['options'] {
    return {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 }, padding: 15 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = this.formatCurrency(context.parsed as number);
              return `${label}: ${value}`;
            }
          }
        }
      }
    };
  }

  getColors() {
    return {
      receitas: '#477BBD',
      despesas: '#DF5C24',
      pie: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      doughnut: ['#22C55E', '#EF4444', '#3B82F6', '#F59E0B', '#A855F7', '#EC4899']
    };
  }

}
