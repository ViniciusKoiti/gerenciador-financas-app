
import { Injectable } from '@angular/core';
import { HttpClientService } from '../http/http-client.service';
import { Observable, of } from 'rxjs';
import { ApiResponse } from '@app/models/api-response';
import { Transaction } from '@app/models/transation';
import {TransactionRequest} from '@models/transaction.request';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private readonly baseUrl = `/transacoes`;

  constructor(private http: HttpClientService) {}

  saveTransaction(transacao: Transaction): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(this.baseUrl, transacao);
  }

  listarTodasTransacoes(): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(this.baseUrl);
  }

  findAll(): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(`${this.baseUrl}/all`);
  }

  findById(id: string): Observable<ApiResponse<Transaction>> {
    return this.http.get<ApiResponse<Transaction>>(`${this.baseUrl}/${id}`);
  }

  findByCategoryId(id: number): Observable<Transaction[]> {
      return this.http.get<Transaction[]>(`/transacoes/categorias/${id}`);
  }

  updateTransactionCategory(transactionId: number, categoryId: number): Observable<ApiResponse<void>> {
    return this.http.patch(`${this.baseUrl}/${transactionId}`, { id: categoryId });
  }

  updateTransaction(id: number, transaction: Transaction): Observable<any> {
    const request = this.mapToRequest(transaction);
    return this.http.put<ApiResponse<Transaction>>(`/${id}`, request)
      .pipe(map(response => response.data));
  }

  private mapToRequest(transaction: Transaction): TransactionRequest {
    return <TransactionRequest>{
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      date: transaction.date.toISOString(),
      categoryId: transaction.categoryId
    };
  }
}
