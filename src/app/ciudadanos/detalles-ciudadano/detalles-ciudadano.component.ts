import { Component, Input, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Ciudadano } from '../../core/modelos/ciudadano.model';
import * as mapboxgl from 'mapbox-gl';
import { environment } from '../../environments/environment';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FormsModule } from '@angular/forms'; // Importar FormsModule

@Component({
  selector: 'app-detalles-ciudadano',
  standalone: true,
  imports: [FormsModule], // Aquí es donde lo importas en la configuración del componente standalone
  templateUrl: './detalles-ciudadano.component.html',
  styleUrls: ['./detalles-ciudadano.component.css']
})
export class DetallesCiudadanoComponent implements AfterViewInit {
  @Input() ciudadano: Ciudadano = {
    nombre_ciudadano: '',
    apellido_ciudadano: '',
    correo_electronico_ciudadano: '',
    telefono_ciudadano: '',
    fecha_nacimiento_ciudadano: new Date(),
    geolocalizacion: 'POINT (0 0)', // Valor predeterminado
    genero: '', // Nuevo campo
    pertenencia_etnica: '', // Nuevo campo
    ubicacion: '' // Nuevo campo
  };
  
  map!: mapboxgl.Map;

  constructor(public activeModal: NgbActiveModal) {}

  ngAfterViewInit(): void {
    if (!this.ciudadano || !this.ciudadano.geolocalizacion) {
      console.warn('Ciudadano o geolocalización no está definida.');
      return;
    }

    const coordinates = this.parseCoordinates(this.ciudadano.geolocalizacion);

    this.map = new mapboxgl.Map({
      container: 'viewMap',
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: coordinates,
      zoom: 14,
      accessToken: environment.mapboxToken,
      attributionControl: false
    });

    new mapboxgl.Marker({ offset: [0, 0] })
      .setLngLat(coordinates)
      .addTo(this.map);

    this.map.on('load', () => {
      const offset: [number, number] = [0, 0];
      this.map.setCenter(coordinates);
      this.map.panBy(offset);
      this.map.resize();
    });
  }

  private parseCoordinates(geoString: string): [number, number] {
    const match = geoString?.match(/POINT\s\(([^)]+)\)/);
    if (!match) {
      console.error('Formato de geolocalización inválido');
      return [0, 0];
    }

    const [lng, lat] = match[1].split(' ').map(coord => parseFloat(coord));
    return [lng, lat];
  }

  cerrarModal() {
    this.activeModal.dismiss();
  }
}
