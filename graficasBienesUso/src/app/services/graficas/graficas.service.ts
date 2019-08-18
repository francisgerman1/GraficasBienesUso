import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { altasEP } from 'src/api/api';

@Injectable({
  providedIn: 'root'
})
export class GraficasService {

  constructor(private httpClient: HttpClient) { }

  getBienesPorAgencia(agenciaId: number, tipoBienesId: number, desde: Date, hasta: Date) {

    if (!agenciaId) {
      agenciaId = 0;
    }
    if (!tipoBienesId) {
      tipoBienesId = 0;
    }
    if (!desde || !hasta) {
      throw new Error('No se ingresaron fechas');
    }

    let parametros = new HttpParams();

    parametros = parametros.set('Agenciasid', agenciaId.toString());
    parametros = parametros.set('Tiposbienesid', tipoBienesId.toString());
    parametros = parametros.set('Desde', this.dateTo_yyyyMMdd(desde));
    parametros = parametros.set('Hasta', this.dateTo_yyyyMMdd(hasta));

    return new Promise<any>((resolve, reject) => {
      this.httpClient.get(altasEP, { params: parametros }).subscribe(datosGrafica => {
        resolve(datosGrafica);
      }, error => {
        reject(error);
      });
    });
  }
  dateTo_yyyyMMdd(date: Date): string {
    const mm = date.getMonth() + 1;
    const dd = date.getDate();

    return [date.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('');
  }
}
