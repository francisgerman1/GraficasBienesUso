import { Injectable } from '@angular/core';
import { Agencia } from 'src/app/models/agencia';
import { agenciasEP } from 'src/api/api';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AgenciasService {

  constructor(private httpClient: HttpClient) { }

  getAgencias() {
    return new Promise<Agencia[]>((resolve, rejected) => {
      this.httpClient.get<Agencia[]>(agenciasEP).subscribe(agencias => {
        resolve(agencias);
      }, error => {
        rejected(error);
      });
    });
  }
}
