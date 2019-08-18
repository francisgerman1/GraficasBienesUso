import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoBien } from 'src/app/models/TipoBien';
import { tiposBienesEP } from 'src/api/api';

@Injectable({
  providedIn: 'root'
})
export class BienesService {

  constructor(private httpClient: HttpClient) { }

  getTiposBienes() {
    return new Promise<TipoBien[]>((resolve, reject) => {
      this.httpClient.get<TipoBien[]>(tiposBienesEP).subscribe(tiposBienes => {
        resolve(tiposBienes);
      }, error => {
        reject(error);
      });
    });
  }
}
