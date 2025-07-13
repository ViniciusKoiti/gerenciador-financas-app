import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Category } from '@models/category';
import { FinancialSummary } from '@shared/services/chart-data.service';
import { CategoryTotals, FinancialDataService, TemporalData } from '@shared/services/financial-data.service';
import { FinancialBarChartComponent } from '@shared/components/financial-bar-chart/financial-bar-chart.component';
import { finalize, forkJoin, Observable, of } from 'rxjs';
import { GraficoResponse, LineGraphService } from '@shared/services/line-graph.service';
import { catchError } from 'rxjs/operators';
import { ResumoFinanceiroResponse } from '@responses/line-graph.response';
import { CategoryPieChartComponent } from '@shared/components/category-chart/category-chart.component';

@Component({
  selector: 'app-report-graph',
  templateUrl: './report-graph.component.html',
  imports: [
    CommonModule,
    MatAccordion,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatIcon,
    MatCard,
    MatCardContent,
    FinancialBarChartComponent,
    CategoryPieChartComponent,
  ],
  standalone: true
})
export class ReportGraphComponent implements OnInit, OnChanges {

  @Input() categories: Category[] = [];
  @Input() isLoading = false;

  // Dados dos gráficos
  resumoFinanceiro: ResumoFinanceiroResponse = {
    saldoTotal: 0,
    totalDespesas: 0,
    totalReceitas: 0
  };

  dadosPorCategoria: GraficoResponse[] = [];
  // evolucaoFinanceira: TransacaoPorPeriodoResponse[] = [];

  // Estados de carregamento
  isLoadingResumo = false;
  isLoadingCategorias = false;
  isLoadingEvolucao = false;

  // Formulário de filtros
  filterForm!: FormGroup;
  showCustomDateRange = false;

  dateRangeOptions = [
    { value: '30', label: 'Últimos 30 dias' },
    { value: '90', label: 'Últimos 3 meses' },
    { value: '180', label: 'Últimos 6 meses' },
    { value: '365', label: 'Último ano' },
    { value: 'custom', label: 'Período personalizado' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private graficoService: LineGraphService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadAllGraphData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] && !changes['categories'].firstChange) {
      this.loadAllGraphData();
    }
  }

  private initializeForm(): void {
    this.filterForm = this.formBuilder.group({
      dateRange: new FormControl<string>('30'),
      startDate: new FormControl<Date | null>(null),
      endDate: new FormControl<Date | null>(null)
    });

    this.filterForm.get('dateRange')?.valueChanges.subscribe(value => {
      this.showCustomDateRange = value === 'custom';
      if (value !== 'custom') {
        this.loadAllGraphData();
      }
    });
  }

  private loadAllGraphData(): void {
    const { startDate, endDate } = this.getDateRange();

    if (!startDate || !endDate) {
      console.error('Datas não definidas');
      return;
    }

    this.isLoadingResumo = true;
    this.isLoadingCategorias = true;
    this.isLoadingEvolucao = true;

    forkJoin({
      categorias: this.graficoService.findTotalDespesas(startDate, endDate)
        .pipe(catchError(err => {
          console.error('Erro ao carregar categorias:', err);
          return of([]);
        })),


    })
      .pipe(
        finalize(() => {
          this.isLoadingResumo = false;
          this.isLoadingCategorias = false;
          this.isLoadingEvolucao = false;
        })
      )
      .subscribe({
        next: (data) => {

          this.dadosPorCategoria = data.categorias;


          console.log('Dados dos gráficos carregados:', {
            resumo: this.resumoFinanceiro,
            categorias: this.dadosPorCategoria,
          });
        },
        error: (error: Error) => {
          console.error('Erro geral ao carregar dados dos gráficos:', error);
        }
      });
  }

  private getDateRange(): { startDate: Date | null; endDate: Date | null } {
    const dateRange = this.filterForm.get('dateRange')?.value;

    if (dateRange === 'custom') {
      return {
        startDate: this.filterForm.get('startDate')?.value,
        endDate: this.filterForm.get('endDate')?.value
      };
    }

    const days = parseInt(dateRange);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    return { startDate, endDate };
  }
  refreshData(): void {
    this.loadAllGraphData();
  }

  get hasData(): boolean {
    return !!(
      this.resumoFinanceiro ||
      this.dadosPorCategoria.length > 0
    );
  }


  get isLoadingAny(): boolean {
    return this.isLoadingResumo || this.isLoadingCategorias || this.isLoadingEvolucao;
  }
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }
  get periodoAtual(): string {
    const { startDate, endDate } = this.getDateRange();
    if (startDate && endDate) {
      return `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
    }
    return '';
  }
  private formatDate(date: Date): string {
    return date.toLocaleDateString('pt-BR');
  }
}
