import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { MatIcon } from '@angular/material/icon';
import { MatCard, MatCardContent } from '@angular/material/card';
import {Category} from '@models/category';
import {FinancialSummary} from '@shared/services/chart-data.service';
import {CategoryTotals, FinancialDataService, TemporalData} from '@shared/services/financial-data.service';

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
    // Importe os componentes de gráfico que você criou
  ],
  standalone: true
})
export class ReportGraphComponent implements OnInit, OnChanges {

  @Input() categories: Category[] = [];
  @Input() isLoading = false;

  resumoFinanceiro: FinancialSummary = {
    totalReceitas: 0,
    totalDespesas: 0,
    saldoTotal: 0
  };

  categoryTotals: CategoryTotals[] = [];
  temporalData: TemporalData[] = [];

  constructor(
    private financialDataService: FinancialDataService
  ) {}

  ngOnInit(): void {
    this.processFinancialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] && this.categories) {
      this.processFinancialData();
    }
  }

  /**
   * Processa os dados financeiros sempre que as categorias mudarem
   */
  private processFinancialData(): void {
    if (!this.categories || this.categories.length === 0) {
      this.resetData();
      return;
    }
    this.resumoFinanceiro = this.financialDataService.calculateFinancialSummary(this.categories);

    this.categoryTotals = this.financialDataService.calculateCategoryTotals(this.categories);

    this.temporalData = this.financialDataService.calculateTemporalData(this.categories);

    console.log('Dados financeiros processados:', {
      resumo: this.resumoFinanceiro,
      categorias: this.categoryTotals,
      temporal: this.temporalData
    });
  }

  private resetData(): void {
    this.resumoFinanceiro = {
      totalReceitas: 0,
      totalDespesas: 0,
      saldoTotal: 0
    };
    this.categoryTotals = [];
    this.temporalData = [];
  }

  formatCurrency(value: number): string {
    return this.financialDataService.formatCurrency(value);
  }
}
