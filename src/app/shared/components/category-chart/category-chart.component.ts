import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import {ChartData, ChartConfiguration, TooltipItem, ChartOptions} from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { GraficoResponse, LineGraphService } from '@shared/services/line-graph.service';

@Component({
  selector: 'app-category-pie-chart',
  templateUrl: "./category-chart.component.html",
  imports: [CommonModule, BaseChartDirective, MatProgressSpinner],
  standalone: true
})
export class CategoryPieChartComponent implements OnChanges {
  @ViewChild('chart') chart?: BaseChartDirective;

  @Input() dadosPorCategoria?: GraficoResponse[];
  @Input() isLoading = false;
  @Input() noDataMessage = 'Nenhuma categoria encontrada';
  @Input() showPercentages = true;

  chartData: ChartData<'pie'> = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'pie'>['options'];

  constructor(private lineGraphService: LineGraphService) {
    this.setupChartOptions();
    this.initializeEmptyData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dadosPorCategoria']) {
      console.log(changes['dadosPorCategoria'])
      this.updateChartData();
    }
  }

  get hasData(): boolean {
    return !!(this.dadosPorCategoria && this.dadosPorCategoria.length > 0);
  }

  protected setupChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            font: {
              size: 11
            },
            padding: 15,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: (context: TooltipItem<'pie'>) => {
              const label = context.label || '';
              const value = this.lineGraphService.formatCurrency(context.parsed as number);
              const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed as number / total) * 100).toFixed(1);

              if (this.showPercentages) {
                return `${label}: ${value} (${percentage}%)`;
              }
              return `${label}: ${value}`;
            }
          }
        }
      },
      animation: {
        duration: 1000
      }
    } as ChartOptions<'pie'>;
  }

  private updateChartData(): void {
    if (!this.dadosPorCategoria || this.dadosPorCategoria.length === 0) {
      this.initializeEmptyData();
      return;
    }

    const dadosValidos = this.dadosPorCategoria.filter(item =>
      item.value != null && item.value > 0
    );

    if (dadosValidos.length === 0) {
      this.initializeEmptyData();
      return;
    }

    dadosValidos.sort((a, b) => b.value - a.value);

    const colors = this.generatePieColors(dadosValidos.length);

    this.chartData = {
      labels: dadosValidos.map(item => item.name),
      datasets: [
        {
          data: dadosValidos.map(item => item.value),
          backgroundColor: colors,
          borderColor: colors.map(() => '#ffffff'),
          borderWidth: 3,
          hoverOffset: 8, // Efeito de "pular" no hover
          hoverBorderWidth: 4,
          hoverBorderColor: '#fff'
        } as any
      ]
    };

    setTimeout(() => this.chart?.chart?.update(), 100);
  }

  /**
   * Gera cores específicas para gráfico de pizza
   * Usa cores mais saturadas e vibrantes
   */
  private generatePieColors(count: number): string[] {
    const pieColors = [
      '#FF6B6B', // Vermelho coral
      '#4ECDC4', // Turquesa
      '#45B7D1', // Azul céu
      '#96CEB4', // Verde menta
      '#FFEAA7', // Amarelo suave
      '#DDA0DD', // Roxo claro
      '#98D8C8', // Verde aqua
      '#F7DC6F', // Amarelo dourado
      '#BB8FCE', // Lavanda
      '#85C1E9', // Azul claro
      '#F8C471', // Laranja suave
      '#82E0AA', // Verde claro
      '#F1948A', // Rosa salmão
      '#85CDFD', // Azul bebê
      '#C39BD3'  // Orquídea
    ];

    while (pieColors.length < count) {
      const hue = (pieColors.length * 137.508) % 360; // Golden angle
      const saturation = 70 + (pieColors.length % 3) * 10; // 70-90%
      const lightness = 60 + (pieColors.length % 2) * 10;  // 60-70%
      pieColors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return pieColors.slice(0, count);
  }

  private initializeEmptyData(): void {
    this.chartData = {
      labels: ['Sem dados'],
      datasets: [
        {
          data: [1],
          backgroundColor: ['#E5E7EB'],
          borderColor: ['#D1D5DB'],
          borderWidth: 2
        }
      ]
    };
  }
}

