import {Component, inject, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef} from '@angular/core';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from '@angular/material/expansion';
import {MatIcon} from '@angular/material/icon';
import {BaseChartDirective} from 'ng2-charts';
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
import {NgxMaskDirective} from 'ngx-mask';
import {LineGraphService} from '@shared/services/line-graph.service';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { MatCard, MatCardContent } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import Chart from 'chart.js/auto';


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
    NgxMaskDirective,
    MatCard,
    MatCardContent,

  ],
  templateUrl: './report-graph.component.html',
  styleUrl: './report-graph.component.scss',
  standalone: true
})
export class ReportGraphComponent implements OnInit, AfterViewInit  {
  @ViewChild('barChart') barChart?: BaseChartDirective;
  
  private readonly lineGraphService = inject(LineGraphService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly datePipe = inject(DatePipe);
  private readonly cdr = inject(ChangeDetectorRef);
  
  filterForm: FormGroup;
  chartsInitialized = false;

  resumoFinanceiro = {
    totalReceitas: 0,
    totalDespesas: 0,
    saldoTotal: 0
  };

  constructor() {
    this.filterForm = this.formBuilder.group({
      dateRange: new FormControl<string>('30'),
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null)
    });

    this.filterForm.get('dateRange')?.valueChanges.subscribe(value => {
      this.showCustomDateRange = value === 'custom';

      if (value !== 'custom') {
        this.fetchData();
      }
    });

    // Ensure all chart data is properly initialized to prevent errors
    this.initializeChartData();
  }

  // Initialize chart data with empty arrays to prevent null reference errors
  initializeChartData(): void {
    // Safe initialization of bar chart data
    if (!this.barChartData || !this.barChartData.datasets) {
      this.barChartData = {
        labels: [],
        datasets: [
          {
            data: [],
            label: 'Receitas',
            backgroundColor: 'rgba(71, 123, 189, 0.7)',
            borderColor: 'rgba(71, 123, 189, 1)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            data: [],
            label: 'Despesas',
            backgroundColor: 'rgba(223, 92, 36, 0.7)',
            borderColor: 'rgba(223, 92, 36, 1)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      };
    }
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

  formatDate(date: Date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'easeInOutQuad'
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 13
          },
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        padding: 12,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
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
            size: 14,
            weight: 'bold'
          },
          padding: {
            bottom: 10
          }
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 20,
        bottom: 10
      }
    }
  };

  barChartLabels:string[] = [];
  chartLabels: string[] = [];
  originalData: any[] = [];

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Receitas',
        backgroundColor: 'rgba(71, 123, 189, 0.7)',
        borderColor: 'rgba(71, 123, 189, 1)',
        borderWidth: 1,
        borderRadius: 4
      },
      {
        data: [],
        label: 'Despesas',
        backgroundColor: 'rgba(223, 92, 36, 0.7)',
        borderColor: 'rgba(223, 92, 36, 1)',
        borderWidth: 1,
        borderRadius: 4
      }
    ]
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

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit chamado - iniciando a configuração dos gráficos...');
    
    // Executar inicialização com um delay maior para garantir que o DOM esteja pronto
    setTimeout(() => {
      console.log('Definindo chartsInitialized = true');
      this.chartsInitialized = true;
      this.cdr.detectChanges();
      
      // Verificar se os elementos DOM dos gráficos existem
      console.log('Verificando elementos DOM dos gráficos:');
      console.log('- Elemento barChart existe no DOM:', !!document.querySelector('canvas#barChart'));
      
      // Forçar atualização para garantir renderização inicial
      this.reinitializeCharts();
    }, 500);
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
    console.log('===== INÍCIO DA ATUALIZAÇÃO DE GRÁFICOS =====');
    
    if (!this.chartsInitialized) {
      console.log('Charts not initialized yet, delaying update...');
      setTimeout(() => this.updateChart(), 300);
      return;
    }
    
    console.log('Attempting to update charts sequentially...');
    
    // Verificar se os elementos DOM dos gráficos existem
    const barCanvasExists = document.querySelector('canvas#barChart');
    
    console.log('Canvas elements in DOM:');
    console.log('- Bar canvas:', !!barCanvasExists);
    
    // Update charts one by one with delays to ensure proper rendering
    setTimeout(() => {
      try {
        console.log('STATUS DOS GRÁFICOS:');
        console.log('- Bar Chart exists:', !!this.barChart);
        console.log('- Bar Chart.chart exists:', !!this.barChart?.chart);
        
        // Primeiro garantir que os dados estão atualizados
        this.updateChartData();
        
        if (this.barChart?.chart) {
          console.log('Updating bar chart...');
          this.barChart.chart.update();
        } else if (this.barChart) {
          console.log('Bar chart needs initialization');
          // Apenas marque para detectar mudanças em vez de chamar hooks
          this.cdr.detectChanges();
        }
        
        this.cdr.detectChanges();
        console.log('Change detection triggered after bar chart update');
        
        console.log('===== FIM DA ATUALIZAÇÃO DE GRÁFICOS =====');
      } catch (error) {
        console.error('Error updating charts:', error);
      }
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

    const formattedStartDate = this.formatDateForBackend(startDate);
    const formattedEndDate = this.formatDateForBackend(endDate);

    if (formattedStartDate && formattedEndDate) {
      forkJoin({
        resumoData: this.lineGraphService.getResumoFinanceiro(new Date(formattedStartDate), new Date(formattedEndDate))
      }).subscribe({
        next: (response) => {
          this.isLoading = false;

          console.log('Resumo Data:', response.resumoData);
          
          if (!response.resumoData) {
            this.noDataMessage = 'Nenhum dado encontrado para o período selecionado.';
          } else {
            this.noDataMessage = '';
            
            this.processResumoData(response.resumoData);
            
            // Give time for Angular to update DOM before trying to update charts
            setTimeout(() => {
              this.reinitializeCharts();
            }, 300);
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
  
  processResumoData(data: any): void {
    if (!data) {
      // Set default values to avoid undefined errors
      this.resumoFinanceiro = {
        totalReceitas: 0,
        totalDespesas: 0,
        saldoTotal: 0
      };
      
      this.barChartData = {
        labels: ['Sem dados'],
        datasets: [
          {
            data: [0],
            label: 'Receitas',
            backgroundColor: 'rgba(71, 123, 189, 0.7)',
            borderColor: 'rgba(71, 123, 189, 1)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            data: [0],
            label: 'Despesas',
            backgroundColor: 'rgba(223, 92, 36, 0.7)',
            borderColor: 'rgba(223, 92, 36, 1)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      };
      return;
    }
    
    console.log('Processing resumo data:', data);
    
    // Atualizar o objeto resumoFinanceiro
    this.resumoFinanceiro = {
      totalReceitas: data.totalReceitas || 0,
      totalDespesas: Math.abs(data.totalDespesas || 0), // Valor absoluto para exibição
      saldoTotal: data.saldo || 0
    };
    
    console.log('Updated resumoFinanceiro:', this.resumoFinanceiro);
    
    // Atualizar dados para o gráfico de barras (comparativo receitas x despesas)
    // Create a completely new data object to force a refresh
    this.barChartData = {
      labels: ['Período Atual'],
      datasets: [
        {
          data: [this.resumoFinanceiro.totalReceitas],
          label: 'Receitas',
          backgroundColor: 'rgba(71, 123, 189, 0.7)',
          borderColor: 'rgba(71, 123, 189, 1)',
          borderWidth: 1,
          borderRadius: 4
        },
        {
          data: [this.resumoFinanceiro.totalDespesas],
          label: 'Despesas',
          backgroundColor: 'rgba(223, 92, 36, 0.7)',
          borderColor: 'rgba(223, 92, 36, 1)',
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    };
    
    console.log('Updated barChartData:', this.barChartData);
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

  reinitializeCharts(): void {
    console.log('===== INÍCIO DE REINICIALIZAÇÃO DE GRÁFICOS =====');
    this.chartsInitialized = false;
    this.cdr.detectChanges();
    
    // Primeiro, validar dados
    this.validateAndSanitizeChartData();
    
    // Verificar se os elementos DOM existem antes de prosseguir
    const barCanvasExists = document.querySelector('canvas#barChart');
    
    console.log('Canvas elements in DOM:');
    console.log('- Bar canvas:', !!barCanvasExists);
    
    if (!barCanvasExists) {
      console.log('Nenhum elemento canvas encontrado no DOM. Aguardando DOM update...');
    }
    
    // Wait for DOM to update and try to initialize charts again
    setTimeout(() => {
      // Garantir que temos dados limpos e válidos
      this.validateAndSanitizeChartData();
      
      this.chartsInitialized = true;
      this.cdr.detectChanges();
      console.log('Charts marked as initialized, DOM should be updated');
      
      // Verificar se os elementos canvas já estão no DOM
      const canvasesExist = !!document.querySelector('canvas#barChart');
      
      if (canvasesExist) {
        console.log('Canvas elements found, proceeding with chart creation...');
        // Force recreation of all charts
        this.destroyAndRecreateCharts();
      } else {
        console.log('Canvas elements still not in DOM, giving more time...');
        // Dar mais tempo para o DOM atualizar
        setTimeout(() => {
          this.cdr.detectChanges();
          console.log('Retrying chart recreation...');
          this.destroyAndRecreateCharts();
        }, 500);
      }
    }, 400);
  }
  
  // Método para validar e sanitizar os dados dos gráficos antes da renderização
  validateAndSanitizeChartData(): void {
    console.log('Validando e sanitizando dados dos gráficos');
    
    // Verificar e corrigir dados do gráfico de barras
    if (!this.barChartData || !this.barChartData.datasets || this.barChartData.datasets.length === 0) {
      console.log('Corrigindo dados do gráfico de barras');
      this.barChartData = {
        labels: ['Sem dados'],
        datasets: [
          {
            data: [0],
            label: 'Receitas',
            backgroundColor: 'rgba(71, 123, 189, 0.7)',
            borderColor: 'rgba(71, 123, 189, 1)',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            data: [0],
            label: 'Despesas',
            backgroundColor: 'rgba(223, 92, 36, 0.7)',
            borderColor: 'rgba(223, 92, 36, 1)',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      };
    }
  }
  
  destroyAndRecreateCharts(): void {
    console.log('Tentando destruir e recriar gráficos...');
    
    try {
      // First destroy all existing charts
      this.destroyChart(this.barChart, 'bar');
      
      console.log('All charts destroyed, waiting for DOM update...');
      
      // Wait for chart cleanup with a longer timeout for better stability
      setTimeout(() => {
        // Force Angular change detection before recreating
        this.cdr.detectChanges();
        
        // Primeiro verificar se há elementos de canvas no DOM
        const barCanvasExists = document.querySelector('canvas#barChart');
        
        console.log('Canvas elements in DOM:');
        console.log('- Bar canvas:', !!barCanvasExists);
        
        console.log('Attempting to create new charts...');
        
        // Se temos os elementos no DOM, podemos tentar inicializar os charts
        if (barCanvasExists) {
          // Aplicar os dados atualizados antes de tentar recriar
          this.updateChartData();
          
          // Iniciar sequência de recriação
          this.recreateBarChart();
        } else {
          console.log('Canvas elements not found in DOM. Waiting longer...');
          // Esperar mais tempo e tentar novamente
          setTimeout(() => {
            this.cdr.detectChanges();
            console.log('Retrying chart recreation...');
            this.recreateBarChart();
          }, 500);
        }
      }, 350);
    } catch (error) {
      console.error('Error during chart destruction:', error);
      // Try basic update as fallback
      this.updateChart();
    }
  }
  
  updateChartData(): void {
    try {
      console.log('===== ATUALIZANDO DADOS DOS GRÁFICOS =====');
      
      if (this.barChart?.chart) {
        console.log('Atualizando dados do bar chart...');
        this.barChart.chart.data = this.barChartData || { labels: [], datasets: [] };
        this.barChart.chart.update();
      }
      
      console.log('Todos os dados dos gráficos foram atualizados');
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error updating chart data:', error);
    }
  }
  
  recreateBarChart(): void {
    setTimeout(() => {
      try {
        if (this.barChart) {
          console.log('Recriando gráfico de barras...');
          // Verificação segura para o método update
          if (this.barChart.chart && typeof this.barChart.chart.update === 'function') {
            this.barChart.chart.update();
          } else {
            console.log('Instância do gráfico de barras não disponível, forçando renderização...');
            // Em vez de ngOnChanges, vamos forçar uma marcação de mudanças
            this.cdr.detectChanges();
            
            // Se o gráfico ainda não foi criado, tentar inicializar os dados
            if (this.barChartData && this.barChartData.datasets) {
              setTimeout(() => {
                // Força a atualização após um tempo para dar chance ao Angular de renderizar
                this.updateChartData();
              }, 100);
            }
          }
          this.cdr.detectChanges();
        } else {
          console.log('Gráfico de barras não disponível');
        }
        console.log('Todos os gráficos foram recriados');
        
        // Verificar o estado final de todos os gráficos
        this.logChartState();
      } catch (error) {
        console.error('Erro ao recriar gráfico de barras:', error);
        console.log('Todos os gráficos foram recriados com erros');
        this.logChartState();
      }
    }, 100);
  }
  
  // Método para registrar informações detalhadas sobre o estado do gráfico
  logChartState(): void {
    console.log(`===== DIAGNÓSTICO: Gráfico de Barras =====`);
    if (!this.barChart) {
      console.log('- Instância do gráfico não existe');
      return;
    }
    
    console.log('- Instância BaseChartDirective existe');
    console.log('- Chart.js instance exists:', !!this.barChart.chart);
    
    if (this.barChart.chart) {
      console.log('- Chart has instance:', true);
      
      // Verificar quais métodos/propriedades estão disponíveis
      const chartPropertiesAvailable = Object.keys(this.barChart.chart).join(', ');
      console.log(`- Chart properties available: ${chartPropertiesAvailable.substring(0, 100)}...`);
      
      console.log('- Has data:', !!this.barChart.chart.data && 
                           !!this.barChart.chart.data.datasets && 
                           this.barChart.chart.data.datasets.length > 0);
      
      // Verificar dados
      if (this.barChart.chart.data && this.barChart.chart.data.datasets && this.barChart.chart.data.datasets.length > 0) {
        const hasData = this.barChart.chart.data.datasets.some(ds => ds.data && ds.data.length > 0);
        console.log('- Datasets have data points:', hasData);
        console.log('- Number of datasets:', this.barChart.chart.data.datasets.length);
        console.log('- First dataset data length:', 
                  this.barChart.chart.data.datasets[0]?.data?.length || 0);
      }
      
      // Verificar se há elementos HTML associados ao gráfico
      console.log('- Canvas element exists:', !!this.barChart.chart.canvas);
      console.log('- Chart area is sized:', 
                this.barChart.chart.canvas && 
                this.barChart.chart.canvas.width > 0 && 
                this.barChart.chart.canvas.height > 0);
    }
  }

  destroyChart(chart: BaseChartDirective | undefined, name: string): void {
    try {
      if (chart) {
        console.log(`Tentando destruir ${name} chart...`);
        // Verificando se o chart existe e tem o método destroy
        if (chart.chart && typeof chart.chart.destroy === 'function') {
          console.log(`Destruindo ${name} chart...`);
          chart.chart.destroy();
        } else {
          console.log(`${name} chart não tem instância ou método destroy`);
        }
      } else {
        console.log(`${name} chart não existe, não é necessário destruir`);
      }
    } catch (error) {
      console.warn(`Erro ao destruir ${name} chart:`, error);
    }
  }
}
