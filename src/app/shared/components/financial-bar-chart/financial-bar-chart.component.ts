import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartConfiguration } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import {GraficoResponse, LineGraphService} from '@shared/services/line-graph.service';

@Component({
  selector: 'app-financial-bar-chart',
  template: `
    <div class="chart-wrapper bg-gray-50 p-4 rounded-lg" style="height: 350px;">
      <div *ngIf="isLoading" class="flex items-center justify-center h-full">
        <mat-spinner diameter="40"></mat-spinner>
      </div>

      <div *ngIf="!isLoading && !hasData" class="flex items-center justify-center h-full">
        <span class="text-gray-500">{{ noDataMessage }}</span>
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

  @Input() dadosPorCategoria?: GraficoResponse[];
  @Input() isLoading = false;
  @Input() noDataMessage = 'Nenhuma categoria encontrada';
  @Input() showValues = true; // Mostrar valores nas barras

  chartData: ChartData<'bar'> = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration<'bar'>['options'];

  constructor(private lineGraphService: LineGraphService) {
    this.setupChartOptions();
    this.initializeEmptyData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dadosPorCategoria']) {
      this.updateChartData();
    }
  }

  get hasData(): boolean {
    return !!(this.dadosPorCategoria && this.dadosPorCategoria.length > 0);
  }

  private setupChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false // Esconder legenda pois é apenas uma série
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const categoria = context.label || '';
              const value = this.lineGraphService.formatCurrency(context.parsed.y);
              return `${categoria}: ${value}`;
            }
          }
        },
        // Plugin para mostrar valores nas barras
        datalabels: this.showValues ? {
          display: true,
          anchor: 'end',
          align: 'top',
          formatter: (value: number) => {
            return this.lineGraphService.formatCurrency(value);
          },
          font: {
            size: 10,
            weight: 'bold'
          },
          color: '#374151'
        } : {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Valor (R$)',
            font: {
              weight: 'bold',
              size: 12
            }
          },
          ticks: {
            callback: (value) => {
              return this.lineGraphService.formatCurrency(Number(value));
            },
            font: {
              size: 11
            }
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        },
        x: {
          title: {
            display: true,
            text: 'Categorias',
            font: {
              weight: 'bold',
              size: 12
            }
          },
          ticks: {
            maxRotation: 45,
            minRotation: 45,
            font: {
              size: 11
            }
          },
          grid: {
            display: false
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      },
      layout: {
        padding: {
          top: this.showValues ? 30 : 10,
          bottom: 10,
          left: 10,
          right: 10
        }
      }
    };
  }

  private updateChartData(): void {
    if (!this.dadosPorCategoria || this.dadosPorCategoria.length === 0) {
      this.initializeEmptyData();
      return;
    }

    const dadosValidos = this.dadosPorCategoria.filter(item =>
      item.value != null && item.value >= 0
    );

    if (dadosValidos.length === 0) {
      this.initializeEmptyData();
      return;
    }

    const colors = this.generateColors(dadosValidos.length);

    this.chartData = {
      labels: dadosValidos.map(item => item.name),
      datasets: [
        {
          data: dadosValidos.map(item => item.value),
          label: 'Valor por Categoria',
          backgroundColor: colors.map(color => color.replace('1)', '0.8)')),
          borderColor: colors,
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false
        } as any // Usar 'as any' para contornar problemas de tipagem do Chart.js
      ]
    };

    // Forçar atualização do gráfico
    setTimeout(() => this.chart?.chart?.update(), 100);
  }

  /**
   * Gera cores dinâmicas e atrativas para as categorias
   */
  private generateColors(count: number): string[] {
    const baseColors = [
      'rgba(239, 68, 68, 1)',   // Vermelho vibrante
      'rgba(59, 130, 246, 1)',  // Azul
      'rgba(245, 158, 11, 1)',  // Amarelo/Laranja
      'rgba(34, 197, 94, 1)',   // Verde
      'rgba(168, 85, 247, 1)',  // Roxo
      'rgba(236, 72, 153, 1)',  // Rosa
      'rgba(14, 165, 233, 1)',  // Azul claro
      'rgba(251, 146, 60, 1)',  // Laranja
      'rgba(99, 102, 241, 1)',  // Índigo
      'rgba(34, 211, 238, 1)',  // Ciano
      'rgba(132, 204, 22, 1)',  // Lima
      'rgba(245, 101, 101, 1)'  // Vermelho claro
    ];

    // Se precisar de mais cores, gerar automaticamente usando HSL
    while (baseColors.length < count) {
      const hue = (baseColors.length * 137.508) % 360; // Golden angle para distribuição uniforme
      const saturation = 65 + (baseColors.length % 3) * 10; // Varia entre 65-85%
      const lightness = 50 + (baseColors.length % 2) * 10;  // Varia entre 50-60%
      baseColors.push(`hsla(${hue}, ${saturation}%, ${lightness}%, 1)`);
    }

    return baseColors.slice(0, count);
  }

  private initializeEmptyData(): void {
    this.chartData = {
      labels: ['Sem dados'],
      datasets: [
        {
          data: [0],
          label: 'Sem dados',
          backgroundColor: 'rgba(229, 231, 235, 0.8)', // Cinza claro
          borderColor: 'rgba(209, 213, 219, 1)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    };
  }
  public exportData(): { categoria: string; valor: string }[] {
    if (!this.dadosPorCategoria) return [];

    return this.dadosPorCategoria.map(item => ({
      categoria: item.name,
      valor: this.lineGraphService.formatCurrency(item.value)
    }));
  }
}
