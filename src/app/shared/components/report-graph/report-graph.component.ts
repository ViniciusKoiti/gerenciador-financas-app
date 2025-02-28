import {Component, inject, OnInit, ViewChild} from '@angular/core';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {BaseChartDirective} from 'ng2-charts';
import {LineGraphService} from '@shared/services/line-graph.service';
import {ChartConfiguration, ChartData} from 'chart.js';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatOption, MatSelect} from '@angular/material/select';
import {CommonModule, DatePipe} from '@angular/common';
import {MatNativeDateModule} from '@angular/material/core';
import {MatInput} from '@angular/material/input';
import {CustomButtonComponent} from '@shared/components/custom-buttom/custom-buttom.component';
import {map} from 'rxjs/operators';
import {CustomPickerFormatsDirective} from '@shared/directive/date-format.directive';

@Component({
  selector: 'app-report-graph',
  imports: [
    MatExpansionPanel,
    MatAccordion,
    MatExpansionPanelHeader,
    MatIcon,
    BaseChartDirective,
    MatProgressSpinner,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatDatepickerToggle,
    MatDatepicker,
    MatLabel,
    MatDatepickerInput,
    MatSelect,
    MatOption,
    MatNativeDateModule,
    CommonModule,
    MatInput,
    CustomButtonComponent,
    CustomPickerFormatsDirective
  ],
  templateUrl: './report-graph.component.html',
  styleUrl: './report-graph.component.scss',
  standalone: true
})
export class ReportGraphComponent implements OnInit  {
  @ViewChild('barChart') barChart?: BaseChartDirective;
  @ViewChild('lineChart') lineChart?: BaseChartDirective;
  private readonly lineGraphService = inject(LineGraphService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly datePipe = inject(DatePipe);
  filterForm: FormGroup;

  constructor() {
    this.filterForm = this.formBuilder.group({
      dateRange: new FormControl<string>('30'),
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null)
    });

    console.log('Valor inicial de dateRange:', this.filterForm.get('dateRange')?.value);


    this.filterForm.get('dateRange')?.valueChanges.subscribe(value => {
      console.log('dateRange alterado:', value);
      this.showCustomDateRange = value === 'custom';

      if (value !== 'custom') {
        this.fetchData();
      }
    });
  }

  dateRangeOptions = [
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 3 meses' },
    { value: '180', label: 'Últimos 6 meses' },
    { value: '365', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  formatDisplayDate = (date: Date | null): string => {
    return date ? this.datePipe.transform(date, 'dd/MM/yyyy') || '' : '';
  };

  isLoading = false;
  showCustomDateRange = false;
  noDataMessage = '';

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

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }




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
  originalData: any[] = [];


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

  formatDateForDisplay(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  formatDateForBackend(date: Date): string {
    return this.datePipe.transform(date, 'yyyy-MM-dd') || '';
  }


  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.isLoading = true;
    this.noDataMessage = '';

    const dateRange = this.filterForm.get('dateRange')?.value || '30';

    if (dateRange === 'custom') {
      this.applyCustomFilter();
      return;
    }

    const endDate = new Date();
    const startDate = new Date();
    const days = parseInt(dateRange);
    startDate.setDate(endDate.getDate() - days);

    this.applyDateFilter(startDate, endDate);
  }


  updateChart() {
    setTimeout(() => {
      this.barChart?.update();
      this.lineChart?.update();
    }, 300);
  }

  applyCustomFilter(): void {
    const startDate = this.filterForm.get('startDate')?.value;
    const endDate = this.filterForm.get('endDate')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        this.noDataMessage = 'Datas inválidas. Por favor, verifique o formato.';
        this.isLoading = false;
        return;
      }

      this.applyDateFilter(start, end);
    } else {
      this.noDataMessage = 'Por favor, selecione ambas as datas inicial e final.';
      this.isLoading = false;
    }
  }


  applyDateFilter(startDate: Date, endDate: Date): void {
    this.isLoading = true;
    this.noDataMessage = '';

    // Format dates using DatePipe before sending to service
    const formattedStartDate = this.formatDateForBackend(startDate);
    const formattedEndDate = this.formatDateForBackend(endDate);

    // Make sure we have valid formatted dates
    if (formattedStartDate && formattedEndDate) {
      this.lineGraphService.findLineGraphs(new Date(formattedStartDate), new Date(formattedEndDate)).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.length === 0) {
            this.noDataMessage = 'Nenhum dado encontrado para o período selecionado.';
          } else {
            this.noDataMessage = '';
            this.processData(response);
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.noDataMessage = 'Erro ao filtrar dados. Tente novamente mais tarde.';
          console.error('Erro ao filtrar dados:', error);
        }
      });
    } else {
      this.isLoading = false;
      this.noDataMessage = 'Erro ao formatar datas. Verifique o formato das datas.';
    }
  }

  processData(data: any[]): void {
    const {labels, dataset} = data.reduce<{ labels: string[], dataset: number[] }>(
      (acc, item) => {
        acc.labels.push(item.name);
        acc.dataset.push(item.value);
        return acc;
      },
      {labels: [], dataset: []}
    );

    if (this.barChartData && this.barChartData.datasets && this.barChartData.datasets.length > 0) {
      this.barChartData.labels = labels;
      this.barChartData.datasets[0].data = dataset;
    }

    if (this.lineChartData && this.lineChartData.datasets && this.lineChartData.datasets.length > 0) {
      this.lineChartData.labels = labels;
      this.lineChartData.datasets[0].data = dataset;
    }

    this.updateChart();
  }

  resetFilters(): void {
    this.filterForm.patchValue({
      dateRange: '30',
      startDate: null,
      endDate: null
    });
    this.showCustomDateRange = false;
    this.fetchData();
  }
}
