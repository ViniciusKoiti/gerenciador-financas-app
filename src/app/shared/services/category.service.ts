import { ApiResponse } from "@app/models/api-response";
import { HttpClientService } from "../http/http-client.service";
import { environment } from "@app/enviroments/enviroments";
import { Category } from "@app/models/category";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
    private readonly baseUrl = `${environment.apiUrl}/api/categorias`;

    constructor(private http: HttpClientService) {}

    saveCategoria(categoria: Category): Observable<ApiResponse<Category>> {
      return this.http.post<ApiResponse<Category>>("/categorias", categoria);
    }

    findAll(): Observable<ApiResponse<Category[]>> {
      return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/all`);
    }

    findById(id: string): Observable<ApiResponse<Category>> {
      return this.http.get<ApiResponse<Category>>(`${this.baseUrl}/${id}`);
    }

    findByUsuarioId(userId: number): Observable<Category[]> {
      return this.http.get<Category[]>(`/categorias/usuarios/${userId}/categorias`);
    }
  }
