import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IVenta } from './venta.model';


@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private readonly apiUrl = '/api';

  constructor(private httpClient: HttpClient) {}

  listar(): Observable<Array<IVenta>> {
    return this.httpClient.get<Array<IVenta>>(`${this.apiUrl}/Ventas`)
  }

  detalle(id: number): Observable<IVenta> {
    return this.httpClient.get<IVenta>(`${this.apiUrl}/Ventas/${id}`);
  }

  registrar(venta: IVenta): Observable<IVenta> {
    return this.httpClient.post<IVenta>(`${this.apiUrl}/Ventas`, venta);
  }


}
