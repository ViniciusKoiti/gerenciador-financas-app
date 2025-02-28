import { Injectable } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Injectable({
  providedIn: 'root'
})
export class ChartConfigService {
  // Paletas de cores para uso em diferentes gráficos
  private readonly colorPalette = [
    'rgba(71, 123, 189, 0.7)',     // Azul
    'rgba(95, 173, 86, 0.7)',      // Verde
    'rgba(242, 142, 43, 0.7)',     // Laranja
    'rgba(223, 92, 36, 0.7)',      // Vermelho alaranjado
    'rgba(178, 55, 56, 0.7)',      // Vermelho
    'rgba(133, 89, 168, 0.7)',     // Roxo
    'rgba(214, 96, 77, 0.7)',      // Coral
    'rgba(76, 180, 168, 0.7)'      // Turquesa
  ];

  private readonly borderPalette = [
    'rgba(71, 123, 189, 1)',
    'rgba(95, 173, 86, 1)',
    'rgba(242, 142, 43, 1)',
    'rgba(223, 92, 36, 1)',
    'rgba(178, 55, 56, 1)',
    'rgba(133, 89, 168, 1)',
    'rgba(214, 96, 77, 1)',
    'rgba(76, 180, 168, 1)'
  ];

  // Função formatadora para valores monetários
  private currencyFormatter(value: any): string {
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
  }

  // Configuração para gráfico de barras
  getBarChartConfig(): {
    type: ChartType,
    data: ChartConfiguration['data'],
    options: ChartConfiguration['options']
  } {
    return {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          data: [],
          label: 'Gasto mensal',
          backgroundColor: this.colorPalette,
          borderColor: this.borderPalette,
          borderWidth: 1,
          borderRadius: 4,
          hoverBackgroundColor: this.colorPalette.map(color => color.replace('0.7', '0.9')),
          hoverBorderColor: this.borderPalette,
          hoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 1000,
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
            text: 'Gastos por Categoria',
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
                  const numericValue = typeof context.parsed.y === 'string'
                    ? parseFloat(context.parsed.y)
                    : context.parsed.y;

                  if (!isNaN(numericValue)) {
                    return label + new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(numericValue);
                  }
                }
                return label;
              }
            }
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
              text: 'Categoria',
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
              },
              maxRotation: 45,
              minRotation: 45
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
        }
      }
    };
  }

  // Configuração para gráfico de linha
  getLineChartConfig(): {
    type: ChartType,
    data: ChartData,
    options: ChartConfiguration['options']
  } {
    return {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          data: [],
          label: 'Tendência de gastos',
          backgroundColor: 'rgba(71, 123, 189, 0.2)',
          borderColor: 'rgba(71, 123, 189, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(71, 123, 189, 1)',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: 'rgba(71, 123, 189, 1)',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
          tension: 0.4,
        }]
      },
      options: {
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
                  const numericValue = typeof context.parsed.y === 'string'
                    ? parseFloat(context.parsed.y)
                    : context.parsed.y;

                  if (!isNaN(numericValue)) {
                    return label + new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(numericValue);
                  }
                }
                return label;
              }
            }
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
      }
    };
  }

  // Método para obter a paleta de cores
  getColorPalette(): string[] {
    return [...this.colorPalette];
  }

  // Método para obter a paleta de bordas
  getBorderPalette(): string[] {
    return [...this.borderPalette];
  }
}
