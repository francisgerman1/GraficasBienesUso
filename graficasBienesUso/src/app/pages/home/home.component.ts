import { AgenciasService } from 'src/app/services/agencias/agencias.service';
import { GraficasService } from 'src/app/services/graficas/graficas.service';
import { BienesService } from 'src/app/services/bienes/bienes.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { TipoBien } from 'src/app/models/TipoBien';
import { Component, OnInit } from '@angular/core';
import { Agencia } from 'src/app/models/agencia';
import { Label } from 'ng2-charts';
import 'hammerjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];

  options: any[] = [];
  agencias: Agencia[];
  tiposBienes: TipoBien[];

  desde: Date;
  hasta: Date;
  agenciaId: number;
  tipoBienId: number;
  waiting: boolean;
  mostrarGrafica: boolean;

  constructor(private agenciasService: AgenciasService, private bienesService: BienesService, private graficasService: GraficasService) {

    // Obtengo las agencias
    this.agenciasService.getAgencias().then(agencias => {
      this.agencias = agencias;
      this.agencias.push({ Id: 0, Nombre: 'Todas', Codigo: '' });
      this.agencias.sort(a => a.Id);
    }).catch(error => {
      console.error(error);
    });

    // Obtengo los tipos de bienes
    this.bienesService.getTiposBienes().then(tipos => {
      this.tiposBienes = tipos;
      this.tiposBienes.push({ Id: 0, Nombre: 'Todos', VidaUtil: 0 });
      this.tiposBienes.sort(t => t.Id);
    }).catch(error => {
      console.error(error);
    });

    this.resetGrafica();
    this.opcionesGrafica();
  }

  ngOnInit() {
  }

  opcionesGrafica() {
    this.options.push({ name: 'Barra', value: 'bar', img: 'assets/img/bar.png' });
    this.options.push({ name: 'Lineal', value: 'line', img: 'assets/img/linear.png' });
    this.options.push({ name: 'Torta', value: 'pie', img: 'assets/img/pie.png' });
    this.options.push({ name: 'Area', value: 'polarArea', img: 'assets/img/polar.png' });
    this.options.push({ name: 'Dona', value: 'doughnut', img: 'assets/img/dona.png' });
    this.options.push({ name: 'Radar', value: 'radar', img: 'assets/img/radar.png' });
  }
  resetGrafica() {
    this.barChartLabels = [];
    this.barChartData = [];
  }

  buscar() {

    if (!this.desde) {
      return this.mensaje('Ingrese la fecha desde');
    }
    if (!this.hasta) {
      return this.mensaje('Ingrese la fecha hasta');
    }
    if (this.tipoBienId === undefined) {
      return this.mensaje('Seleccione un tipo de bien');
    }
    if (this.agenciaId === undefined) {
      return this.mensaje('Seleccione una agencia');
    }

    this.waiting = true;

    this.graficasService.getBienesPorAgencia(this.agenciaId, this.tipoBienId, this.desde, this.hasta).then(grafica => {

      this.resetGrafica();

      // Selecciono todas las agencias y un tipo de bien.
      if (this.agenciaId === 0 && this.tipoBienId !== 0) {

        const dataset: ChartDataSets[] = [
          { data: [], label: 'Costo' },
          { data: [], label: 'Cantidad' }
        ];

        for (const element of grafica) {
          this.barChartLabels.push(element.AgenciasNombre);
          dataset[0].data.push(element.DatosTipos.length === 0 ? 0 : Number(element.DatosTipos[0].BienesCostoOriginal));
          dataset[1].data.push(element.DatosTipos.length === 0 ? 0 : Number(element.DatosTipos[0].Cantidad));
        }

        this.barChartData = dataset;
        this.mostrarGrafica = this.haydatosGrafica();

      } else {

      }
      this.waiting = false;
    }).catch(error => {
      console.error(error);
      this.waiting = false;
    });


  }
  mensaje(msg) {
    alert(msg);
  }
  haydatosGrafica(): boolean {
    for (const elem of this.barChartData) {
      for (const numero of elem.data) {
        if (numero !== 0) {
          return true;
        }
      }
    }
    return false;
  }
}
