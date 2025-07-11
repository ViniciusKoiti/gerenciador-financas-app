import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {FinancialSummary} from '@shared/services/chart-data.service';
import {FinancialDataService} from '@shared/services/financial-data.service';

@Component({
  selector: 'app-financial-bar-chart',
  template: `
    <div class="chart-wrapper bg-gray-50 p-4 rounded-lg" style="height: 350px;">
      <div *ngIf="isLoading" class="flex items-center justify-center h-full">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!isLoading && !hasData" class="flex items-center justify-center h-full">
        <span class="text-gray-500">Nenhuma transação encontrada</span>
      </div>

      <div *ngIf="!isLoading && hasData" class="h-full w-full position-relative">
        <canvas
          baseChart
          #chart
          [type]="'bar'"
          [data]="chartData"
          [options]="chartOptions">
        </canvas>
      </div>
    </div>
  `,
  imports: [CommonModule, BaseChartDirective, MatProgressSpinner],
  standalone: true
})
export class FinancialBarChartComponent implements OnChanges {
  @ViewChild('chart') chart?: BaseChartDirective;

  @Input() financialSummary?: FinancialSummary;
  @Input() isLoading = false;

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'bar'>['options'];

  constructor(private financialDataService: FinancialDataService) {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 13 }, padding: 20 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.dataset.label || '';
              const value = this.financialDataService.formatCurrency(context.parsed.y);
              return `${label}: ${value}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Valor (R$)' },
          ticks: {
            callback: (value) => {
              return this.financialDataService.formatCurrency(Number(value));
            }
          }
        }
      }
    };

    this.initializeEmptyData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['financialSummary'] && this.financialSummary) {
      this.updateChartData();
    }
  }

  get hasData(): boolean {
    return this.financialSummary ?
      (this.financialSummary.totalReceitas > 0 || this.financialSummary.totalDespesas > 0) : false;
  }

  private updateChartData(): void {
    if (!this.financialSummary) {
      this.initializeEmptyData();
      return;
    }

    this.chartData = {
      labels: ['Resumo Financeiro'],
      datasets: [
        {
          data: [this.financialSummary.totalReceitas],
          label: 'Receitas',
          backgroundColor: 'rgba(34, 197, 94, 0.8)', // Verde
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 1
        },
        {
          data: [this.financialSummary.totalDespesas],
          label: 'Despesas',
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgba(239, 68, 68, 1)',
          borderWidth: 1
        }
      ]
    };

    setTimeout(() => this.chart?.chart?.update(), 100);
  }

  private initializeEmptyData(): void {
    this.chartData = {
      labels: ['Sem dados'],
      datasets: [
        { data: [0], label: 'Receitas', backgroundColor: '#E5E7EB' },
        { data: [0], label: 'Despesas', backgroundColor: '#E5E7EB' }
      ]
    };
  }
}
