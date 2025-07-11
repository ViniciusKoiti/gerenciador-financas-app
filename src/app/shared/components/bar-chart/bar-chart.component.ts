import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {ChartDataService, FinancialSummary} from '@shared/services/chart-data.service';

@Component({
  selector: 'app-bar-chart',
  template: `
    <div class="chart-wrapper bg-gray-50 p-4 rounded-lg" style="height: 350px;">
      <div *ngIf="isLoading" class="flex items-center justify-center h-full">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!isLoading && !hasData" class="flex items-center justify-center h-full">
        <span class="text-gray-500">{{ noDataMessage || 'Sem dados para exibir' }}</span>
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
export class BarChartComponent implements OnChanges {
  @ViewChild('chart') chart?: BaseChartDirective;

  @Input() data?: FinancialSummary;
  @Input() isLoading = false;
  @Input() noDataMessage = '';

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'bar'>['options'];

  constructor(private chartDataService: ChartDataService) {
    this.chartOptions = this.chartDataService.getDefaultBarOptions();
    this.initializeEmptyData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChartData();
    }
  }

  get hasData(): boolean {
    return this.chartData.datasets.length > 0 &&
      this.chartData.datasets[0].data.length > 0 &&
      this.chartData.datasets[0].data.some(val => {
        const numericValue = typeof val === 'number' ? val : (Array.isArray(val) ? val[1] : 0);
        return numericValue != null && numericValue > 0;
      });
  }

  private updateChartData(): void {
    if (!this.data) {
      this.initializeEmptyData();
      return;
    }

    const colors = this.chartDataService.getColors();

    this.chartData = {
      labels: ['Período Atual'],
      datasets: [
        {
          data: [this.data.totalReceitas],
          label: 'Receitas',
          backgroundColor: colors.receitas + '80',
          borderColor: colors.receitas,
          borderWidth: 1
        },
        {
          data: [this.data.totalDespesas],
          label: 'Despesas',
          backgroundColor: colors.despesas + '80',
          borderColor: colors.despesas,
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
        { data: [0], label: 'Receitas', backgroundColor: '#C7C7C7' },
        { data: [0], label: 'Despesas', backgroundColor: '#C7C7C7' }
      ]
    };
  }
}
