import {Injectable} from '@angular/core';
import {Transaction} from '@models/transation';
import {Observable} from 'rxjs';
import {ApiResponse} from '@models/api-response';
import {HttpClientService} from '@shared/http/http-client.service';
import {HttpParams} from '@angular/common/http';
import {LineGraphResponse} from '@responses/line-graph.response';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class LineGraphService {

  private readonly baseUrl = "/grafico"

  constructor(private http: HttpClientService, private datePipe: DatePipe) {}

  findLineGraphs(dateInicio: Date, dataFim: Date): Observable<LineGraphResponse[]> {


    const params = new HttpParams()
      .set('dataInicio', dateInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    const options: { params: HttpParams } = { params };

    return this.http.get<LineGraphResponse[]>(
      `${this.baseUrl}/categoria`,
      options
    );
  }

  getEvolucaoFinanceira(startDate: Date, endDate: Date): Observable<any[]> {
    const params = this.createDateParams(startDate, endDate);
    return this.http.get<any[]>(`${this.baseUrl}/evolucao`, { params });
  }

  getResumoFinanceiro(startDate: Date, endDate: Date): Observable<any> {
    const params = this.createDateParams(startDate, endDate);
    return this.http.get<any>(`${this.baseUrl}/resumo`, { params });
  }

  private createDateParams(startDate: Date, endDate: Date): HttpParams {
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

}
