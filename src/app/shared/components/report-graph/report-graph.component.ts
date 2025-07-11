import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import {Category} from '@models/category';
import {FinancialSummary} from '@shared/services/chart-data.service';
import {CategoryTotals, FinancialDataService, TemporalData} from '@shared/services/financial-data.service';
import {FinancialBarChartComponent} from '@shared/components/financial-bar-chart/financial-bar-chart.component';
import {finalize, forkJoin, Observable, ObservedValueOf, of} from 'rxjs';
import {GraficoResponse, LineGraphService} from '@shared/services/line-graph.service';
import {catchError} from 'rxjs/operators';
import {ResumoFinanceiroResponse} from '@responses/line-graph.response';


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
  ],
  standalone: true
})
export class ReportGraphComponent implements OnInit, OnChanges {

  @Input() categories: Category[] = [];
  @Input() isLoading = false;

  resumoFinanceiro: ResumoFinanceiroResponse = {
    saldoTotal:0,
    totalDespesas: 0,
    totalReceitas: 0
  }
  dadosPorCategoria: GraficoResponse[] = [];

  isLoadingResumo = false;
  isLoadingCategorias = false;
  isLoadingEvolucao = false;

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
      categorias: this.graficoService.findLineGraphs(startDate, endDate)
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
        error: (error : Error) => {
          console.error('Erro geral ao carregar dados dos gráficos:', error);
        }
      });
  }

  /**
   * Calcula as datas baseado no filtro selecionado
   */
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

  /**
   * Aplicar filtros customizados
   */
  applyCustomFilter(): void {
    if (this.showCustomDateRange) {
      const startDate = this.filterForm.get('startDate')?.value;
      const endDate = this.filterForm.get('endDate')?.value;

      if (startDate && endDate) {
        this.loadAllGraphData();
      } else {
        console.warn('Por favor, selecione ambas as datas');
      }
    }
  }

  /**
   * Resetar filtros
   */
  resetFilters(): void {
    this.filterForm.patchValue({
      dateRange: '30',
      startDate: null,
      endDate: null
    });
    this.showCustomDateRange = false;
    this.loadAllGraphData();
  }

  /**
   * Recarregar dados manualmente
   */
  refreshData(): void {
    this.loadAllGraphData();
  }

  /**
   * Verificar se há dados para exibir
   */
  get hasData(): boolean {
    return !!(this.resumoFinanceiro || this.dadosPorCategoria.length > 0);
  }

  /**
   * Verificar se está carregando algum dado
   */
  get isLoadingAny(): boolean {
    return this.isLoadingResumo || this.isLoadingCategorias || this.isLoadingEvolucao;
  }

  /**
   * Formatar moeda usando o service
   */
  formatCurrency(value: number): string {
    return this.graficoService.formatCurrency(value);
  }


  get periodoAtual(): string {
    if (!this.resumoFinanceiro) return '';

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
