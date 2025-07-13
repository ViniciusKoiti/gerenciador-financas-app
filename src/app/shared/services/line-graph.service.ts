
export interface GraficoResponse {
  name: string;
  value: number;
}

export interface ResumoFinanceiroResponse {
  totalReceitas: number;
  totalDespesas: number;
  saldoTotal: number;
  periodo?: {
    dataInicio: string;
    dataFim: string;
  };
}

export interface EvolucaoFinanceiraResponse {
  periodo: string;
  receitas: number;
  despesas: number;
  saldo?: number;

}



import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { HttpClientService } from '@shared/http/http-client.service';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LineGraphService {
  private readonly baseUrl = '/grafico';

  constructor(
    private http: HttpClientService,
    private datePipe: DatePipe
  ) {}
  findTotalDespesas(dateInicio: Date, dataFim: Date): Observable<GraficoResponse[]> {

    const params = new HttpParams()
      .set('dataInicio', dateInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    const options: { params: HttpParams } = { params };

    return this.http.get<GraficoResponse[]>(
      `${this.baseUrl}/categoria/despesas`,
      options
    );
  }

  private createDateParams(startDate: Date, endDate: Date): HttpParams {
    if (!startDate || !endDate) {
      throw new Error('Datas de início e fim são obrigatórias');
    }

    if (startDate > endDate) {
      throw new Error('Data de início não pode ser maior que data de fim');
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const startISO = this.formatDateToISOLocal(start);
    const endISO = this.formatDateToISOLocal(end);

    return new HttpParams()
      .set('dataInicio', startISO)
      .set('dataFim', endISO);
  }
  private formatDateToISOLocal(date: Date): string {
    return date.toISOString();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  calculateDaysBetween(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }
  validateDateRange(startDate: Date, endDate: Date): { valid: boolean; message?: string } {
    if (!startDate || !endDate) {
      return { valid: false, message: 'Datas de início e fim são obrigatórias' };
    }

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return { valid: false, message: 'Datas inválidas' };
    }

    if (startDate > endDate) {
      return { valid: false, message: 'Data de início não pode ser maior que data de fim' };
    }

    const daysDiff = this.calculateDaysBetween(startDate, endDate);
    if (daysDiff > 365) {
      return { valid: false, message: 'Período não pode ser maior que 365 dias' };
    }

    return { valid: true };
  }
}

