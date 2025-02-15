import { ApiResponse } from "@app/models/api-response";
import { HttpClientService } from "../http/http-client.service";
import { environment } from "@app/enviroments/enviroments";
import { Category } from "@app/models/category";
import {delay, Observable, retry} from "rxjs";
import { Injectable } from "@angular/core";
import { Transaction } from "@app/models/transation";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
    private readonly baseUrl = `${environment.apiUrl}/api/transacoes`;

    constructor(private http: HttpClientService) {}

    saveTransaction(transacao: Transaction): Observable<ApiResponse<Transaction>> {
      return this.http.post<ApiResponse<Transaction>>("/transacoes", transacao);
    }

    findAll(): Observable<ApiResponse<Transaction[]>> {
      return this.http.get<ApiResponse<Transaction[]>>(`${this.baseUrl}/all`);
    }

    findById(id: string): Observable<ApiResponse<Transaction>> {
      return this.http.get<ApiResponse<Transaction>>(`/transacoes/${id}`);
    }

  updateTransactionCategory(transactionId: number | undefined, categoryId: number): Observable<any> {
    return this.http.put(`/api/transactions/${transactionId}`, {
      categoryId
    }).pipe(
      retry(1),
      delay(300)
    );
  }
  }
