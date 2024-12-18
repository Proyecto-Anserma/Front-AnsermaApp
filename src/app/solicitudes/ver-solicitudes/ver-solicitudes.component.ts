import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/servicios/service';
import { SOLICITUD } from '../../environments/api-costant';
import { SolicitudResponse, SolicitudFiltrar } from '../../core/modelos/solicitud.model'; 
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditarSolicitudComponent } from '../editar-solicitud/editar-solicitud.component';
import { DetallesSolicitudComponent } from '../detalles-solicitud/detalles-solicitud.component';
import { CrearSolicitudComponent } from '../crear-solicitud/crear-solicitud.component';
import { EliminarSolicitudComponent } from '../eliminar-solicitud/eliminar-solicitud.component';

@Component({
  selector: 'app-ver-solicitudes',
  standalone: true,
  imports: [FormsModule, CommonModule],  
  templateUrl: './ver-solicitudes.component.html',
  styleUrls: ['./ver-solicitudes.component.css']
})
export class VerSolicitudesComponent implements OnInit {
  solicitudes: SolicitudResponse[] = []; 
  descripcionFiltro: string = '';
  cedulaFiltro: string = '';
  loading: boolean = false;

  constructor(private apiService: ApiService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.loading = true;
    const filtro = new SolicitudFiltrar('', ''); 

    this.apiService.post(SOLICITUD.FILTRAR_SOLICITUDES, filtro).subscribe({
      next: (respuesta: SolicitudResponse[]) => {
        this.solicitudes = respuesta;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar solicitudes: ', error);
        this.loading = false;
      }
    });
  }

  consultarPorDato(): void {
    if (!this.descripcionFiltro && !this.cedulaFiltro) {
      console.warn('Por favor ingrese al menos una descripción o cédula para filtrar.');
      return;
    }

    const filtro = new SolicitudFiltrar(this.descripcionFiltro, this.cedulaFiltro);

    this.loading = true;
    this.apiService.post(SOLICITUD.FILTRAR_SOLICITUDES, filtro).subscribe({
      next: (respuesta: SolicitudResponse[]) => { 
        this.solicitudes = respuesta;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al consultar por descripción o cédula: ', error);
        this.loading = false;
      }
    });
  }

  limpiarFiltros(): void {
    this.descripcionFiltro = '';
    this.cedulaFiltro = '';
    this.cargarSolicitudes();
  }

  abrirModalDetalles(solicitud: SolicitudResponse) {
    const modalRef = this.modalService.open(DetallesSolicitudComponent, { size: 'lg' });
    modalRef.componentInstance.solicitud = { ...solicitud }; // Pasar los datos de la solicitud al modal
  }  

  abrirModalEditar(solicitud: SolicitudResponse) {
    const modalRef = this.modalService.open(EditarSolicitudComponent);
    modalRef.componentInstance.solicitud = { ...solicitud }; 
  
    modalRef.result.then(
      (resultado: SolicitudResponse) => {
        if (resultado) {
          // Actualizamos la solicitud en la lista local
          const index = this.solicitudes.findIndex(s => s.id_solicitud === resultado.id_solicitud);
          if (index > -1) {
            this.solicitudes[index] = resultado;
          }
        }
      },
      () => {
        console.log('Modal cerrado sin cambios');
      }
    );
  }  

  abrirModalCrear(): void {
    const modalRef = this.modalService.open(CrearSolicitudComponent);

    modalRef.result.then(
      (nuevaSolicitud: SolicitudResponse) => {
        if (nuevaSolicitud) {
          const body = {
            descripcion_solicitud: nuevaSolicitud.descripcion_solicitud,
            id_ciudadano_solicitud: nuevaSolicitud.id_ciudadano_solicitud,
            fecha_creacion_solicitud: nuevaSolicitud.fecha_creacion_solicitud,
            id_tipo_solicitud: nuevaSolicitud.id_tipo_solicitud
          };

          this.apiService.post(SOLICITUD.CREAR_SOLICITUD, body).subscribe({
            next: (respuesta: SolicitudResponse) => {
              this.solicitudes.push(respuesta);
              console.log('Solicitud creada exitosamente');
            },
            error: (error) => {
              console.error('Error al crear la solicitud:', error);
            }
          });
        }
      },
      () => {
        console.log('Modal de creación cerrado');
      }
    );
  }

  abrirModalEliminar(solicitud: SolicitudResponse): void {
    const modalRef = this.modalService.open(EliminarSolicitudComponent);
    modalRef.componentInstance.solicitud = solicitud;

    modalRef.result.then(
      (solicitudAEliminar: SolicitudResponse) => {
        if (solicitudAEliminar) {
          this.apiService.delete(`${SOLICITUD.ELIMINAR_SOLICITUD}/${solicitudAEliminar.id_solicitud}`).subscribe({
            next: () => {
              this.solicitudes = this.solicitudes.filter(s => s.id_solicitud !== solicitudAEliminar.id_solicitud);
              console.log('Solicitud eliminada exitosamente');
            },
            error: (error) => {
              console.error('Error al eliminar la solicitud:', error);
            }
          });
        }
      },
      () => {
        console.log('Modal de eliminación cerrado');
      }
    );
  }
}
