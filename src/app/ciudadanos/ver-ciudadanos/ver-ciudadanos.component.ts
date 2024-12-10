import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/servicios/service';
import { Ciudadano } from '../../core/modelos/ciudadano.model';
import { CIUDADANO } from '../../environments/api-costant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditarCiudadanoComponent } from '../editar-ciudadano/editar-ciudadano.component';
//import { CrearCiudadanoComponent } from '../crear-ciudadano/crear-ciudadano.component';
import { DetallesCiudadanoComponent } from '../detalles-ciudadano/detalles-ciudadano.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ver-ciudadanos',
  templateUrl: './ver-ciudadanos.component.html',
  styleUrls: ['./ver-ciudadanos.component.css'],
  standalone: true, 
  imports: [CommonModule]
})
export class VerCiudadanosComponent implements OnInit {
  ciudadanos: Ciudadano[] = [];

  constructor(
    private apiService: ApiService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.consultar_ciudadanos();
  }

  consultar_ciudadanos(cedula?: string) {
    const body = {
      cedula: cedula || ''
    };

    this.apiService.post(CIUDADANO.CONSULTAR_CIUDADANOS, body).subscribe({
      next: (respuesta) => {
        this.ciudadanos = respuesta;
      },
      error: (error) => {
        console.error('Se produjo un error: ' + error);
      }
    });
  }

  abrirModalDetalles(ciudadano: Ciudadano) {
    const modalRef = this.modalService.open(DetallesCiudadanoComponent, { size: 'lg' });
    modalRef.componentInstance.ciudadano = { ...ciudadano }; // Pasar los datos del ciudadano al modal
  }

  abrirModalEditar(ciudadano: Ciudadano) {
    const modalRef = this.modalService.open(EditarCiudadanoComponent);
    modalRef.componentInstance.ciudadano = { ...ciudadano }; 
  }
}
