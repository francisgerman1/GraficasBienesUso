import { AgenciasService } from 'src/app/services/agencias/agencias.service';
import { GraficasService } from 'src/app/services/graficas/graficas.service';
import { BienesService } from 'src/app/services/bienes/bienes.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { TipoBien } from 'src/app/models/TipoBien';
import { Component, OnInit } from '@angular/core';
import { Agencia } from 'src/app/models/agencia';
import { Label } from 'ng2-charts';
import Swal from 'sweetalert2';
import 'hammerjs';

export enum Select { AGENCIA, TIPO_BIEN }

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
      xAxes: [{
        ticks: {
          beginAtZero: true
        }
      }]
    }
  };
  barChartLabels: Label[];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[];

  options: any[] = [];
  agencias: Agencia[];
  agenciasAux: Agencia[];
  tiposBienes: TipoBien[];
  tiposBienesAux: TipoBien[];

  desde: Date;
  hasta: Date;
  agenciaId: number;
  tipoBienId: number;
  waiting: boolean;
  mostrarGrafica: boolean;

  constructor(private agenciasService: AgenciasService, private bienesService: BienesService, private graficasService: GraficasService) {
    this.llenarAgencias().then(() => {
      this.llenarTiposBienes().then(() => {
        this.resetGrafica();
        this.opcionesGrafica();
        this.initGrafica();
      });
    });
  }
  initGrafica() {
    this.agenciaId = 1; // Agencia central id=1
    this.tipoBienId = 0; // Todos los bienes id=0
    const lastYear = new Date().getFullYear() - 1;
    this.desde = new Date(new Date().setFullYear(lastYear, 0, 1));
    this.hasta = new Date(new Date().setFullYear(lastYear, 11, 31));
    this.selectChange({ value: 1 }, Select.AGENCIA);
    this.buscar();
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

      const dataset: ChartDataSets[] = [
        { data: [], label: 'Costo', hidden: false },
        { data: [], label: 'Cantidad', hidden: true }
      ];

      // Selecciono todas las agencias y un tipo de bien.
      if (this.agenciaId === 0 && this.tipoBienId !== 0) {

        for (const element of grafica) {
          this.barChartLabels.push(element.AgenciasNombre);
          dataset[0].data.push(element.DatosTipos.length === 0 ? 0 : Number(element.DatosTipos[0].BienesCostoOriginal));
          dataset[1].data.push(element.DatosTipos.length === 0 ? 0 : Number(element.DatosTipos[0].Cantidad));
        }

      }
      // Selecciono una agencia y todos los tipos de bienes
      if (this.agenciaId !== 0 && this.tipoBienId === 0) {

        if (grafica[0]) {
          for (const datostipos of grafica[0].DatosTipos) {
            this.barChartLabels.push(datostipos.TiposBienesNombre);
            dataset[0].data.push(Number(datostipos.BienesCostoOriginal));
            dataset[1].data.push(Number(datostipos.Cantidad));
          }
        }

      }
      if (this.agenciaId !== 0 && this.tipoBienId !== 0) {
        console.log('No tiene sentido mostrar un tipo de bien de una sola agencia');
      }

      this.barChartData = dataset;
      this.mostrarGrafica = this.haydatosGrafica();
      this.waiting = false;
    }).catch(error => {
      console.error(error);
      this.waiting = false;
    });


  }
  mensaje(msg) {
    Swal.fire({
      title: 'Mensaje',
      text: msg,
      type: 'warning',
      confirmButtonText: 'Ok'
    });
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
  llenarAgencias() {
    // Obtengo las agencias
    return this.agenciasService.getAgencias().then(agencias => {
      this.agencias = agencias;
      this.agenciasAux = agencias;
      this.agencias.push({ Id: 0, Nombre: 'Todas', Codigo: '' });
      this.agencias.sort(a => a.Id);
    }).catch(error => {
      console.error(error);
    });
  }
  llenarTiposBienes() {
    // Obtengo los tipos de bienes
    return this.bienesService.getTiposBienes().then(tipos => {
      this.tiposBienes = tipos;
      this.tiposBienesAux = tipos;
      this.tiposBienes.push({ Id: 0, Nombre: 'Todos', VidaUtil: 0 });
      this.tiposBienes.sort(t => t.Id);
    }).catch(error => {
      console.error(error);
    });
  }
  selectChange(event, tipo: Select) {
    if (tipo === Select.AGENCIA) {
      if (event.value === 0) {
        this.tiposBienesAux = this.tiposBienes.filter(t => t.Id !== 0);
      } else {
        this.tiposBienesAux = this.tiposBienes.filter(t => t.Id === 0);
      }
    }
    if (tipo === Select.TIPO_BIEN) {
      this.agenciasAux = this.agencias;
    }
  }
}
