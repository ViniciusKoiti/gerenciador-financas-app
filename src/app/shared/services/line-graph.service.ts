import {Injectable} from '@angular/core';
import {Transaction} from '@models/transation';
import {Observable} from 'rxjs';
import {ApiResponse} from '@models/api-response';
import {HttpClientService} from '@shared/http/http-client.service';
import {HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LineGraphService {

  private readonly baseUrl = "/grafico"

  constructor(private http: HttpClientService) {}

  findLineGraphs(dateInicio: Date, dataFim: Date): Observable<ApiResponse<LineGraphService>> {


    const params = new HttpParams()
      .set('dataInicio', dateInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    const options: { params: HttpParams } = { params };

    return this.http.get<ApiResponse<LineGraphService>>(
      `${this.baseUrl}/total/categoria`,
      options
    );
  }

}
