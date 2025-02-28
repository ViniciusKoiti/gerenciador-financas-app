import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {BaseChartDirective} from 'ng2-charts';
import {LineGraphService} from '@shared/services/line-graph.service';
import {ChartConfiguration, ChartData} from 'chart.js';

@Component({
  selector: 'app-report-graph',
  imports: [
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelHeader,
    MatIcon,
    BaseChartDirective
  ],
  templateUrl: './report-graph.component.html',
  styleUrl: './report-graph.component.scss',
  standalone: true
})
export class ReportGraphComponent implements OnInit  {
  @ViewChild('barChart') barChart?: BaseChartDirective;
  private readonly lineGraphService = inject(LineGraphService);
  private colorPalette = [
    'rgba(71, 123, 189, 0.7)',     // Azul
    'rgba(95, 173, 86, 0.7)',      // Verde
    'rgba(242, 142, 43, 0.7)',     // Laranja
    'rgba(223, 92, 36, 0.7)',      // Vermelho alaranjado
    'rgba(178, 55, 56, 0.7)',      // Vermelho
    'rgba(133, 89, 168, 0.7)',     // Roxo
    'rgba(214, 96, 77, 0.7)',      // Coral
    'rgba(76, 180, 168, 0.7)'      // Turquesa
  ];

  private borderPalette = [
    'rgba(71, 123, 189, 1)',
    'rgba(95, 173, 86, 1)',
    'rgba(242, 142, 43, 1)',
    'rgba(223, 92, 36, 1)',
    'rgba(178, 55, 56, 1)',
    'rgba(133, 89, 168, 1)',
    'rgba(214, 96, 77, 1)',
    'rgba(76, 180, 168, 1)'
  ];


  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Gasto mensal',
      backgroundColor: this.colorPalette,
      borderColor: this.borderPalette,
      borderWidth: 1,
      borderRadius: 4,

    }]
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },

      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Valor (R$)'
        }
      },

    }
  };

  barChartLabels:string[] = [];
  chartLabels: string[] = [];

  public lineChartData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Tendência de gastos',
      backgroundColor: 'rgba(71, 123, 189, 0.2)',
      borderColor: 'rgba(71, 123, 189, 1)',
      borderWidth: 2
    }]
  };


  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1200,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            size: 12
          },
          usePointStyle: true,
          padding: 20
        }
      },
      title: {
        display: true,
        text: 'Tendência de Gastos',
        font: {
          family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
          size: 16,
          weight: 'bold'
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 4,
        displayColors: true,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
      datalabels: {
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
            family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          callback: function(value) {

            const numericValue = typeof value === 'string' ? parseFloat(value) : value;

            if (!isNaN(numericValue)) {
              return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(numericValue);
            }

            return '';
          },
          font: {
            family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            size: 11
          }
        },
        grid: {
          color: 'rgba(200, 200, 200, 0.2)'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Mês',
          font: {
            family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            size: 12,
            weight: 'bold'
          }
        },
        ticks: {
          font: {
            family: "'Segoe UI', 'Roboto', 'Helvetica Neue', sans-serif",
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 20,
        top: 0,
        bottom: 10
      }
    },
    elements: {
      line: {
        tension: 0.4
      }
    }
  };





  ngOnInit(): void {
    this.findGraphData();
  }


  updateChart() {
    setTimeout(() => {
      this.barChart?.update();
    }, 300);
  }

  findGraphData(): void {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 1);
    const lastMonth = new Date();
    lastMonth.setFullYear(lastMonth.getFullYear() - 1);
    lastMonth.setDate(today.getDate() - 30);

    this.lineGraphService.findLineGraphs(lastMonth, today).subscribe(response => {
      const {labels, dataset} =
        response.reduce<{ labels: string[], dataset: number[] }>((acc, item) => {
          acc.labels.push(item.name);
          acc.dataset.push(item.value);
          return acc;
        }, {labels: [], dataset: []});

      this.barChartLabels = labels;
      this.chartLabels = labels;
      this.barChartData.datasets[0].data = dataset as any;
      this.lineChartData.labels = labels;
      this.lineChartData.datasets[0].data = dataset as any;
      this.updateChart();
    });
  }

}
