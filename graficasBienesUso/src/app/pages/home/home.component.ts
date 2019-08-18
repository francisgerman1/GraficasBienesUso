import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { AgenciasService } from 'src/app/services/agencias/agencias.service';
import { Agencia } from 'src/app/models/agencia';
import { TipoBien } from 'src/app/models/TipoBien';
import 'hammerjs';
import { BienesService } from 'src/app/services/bienes/bienes.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
  ];

  agencias: Agencia[];
  tiposBienes: TipoBien[];

  constructor(private agenciasService: AgenciasService, private bienesService: BienesService) {

    // Obtengo las agencias
    this.agenciasService.getAgencias().then(agencias => {
      this.agencias = agencias;
    }).catch(error => {
      console.log(error);
    });

    // Obtengo los tipos de bienes
    this.bienesService.getTiposBienes().then(tipos => {
      this.tiposBienes = tipos;
    }).catch(error => {
      console.log(error);
    });

  }

  ngOnInit() {
  }

  buscar() {
    console.log('buscar');

  }

}
