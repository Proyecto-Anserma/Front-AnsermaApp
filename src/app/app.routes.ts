import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'ciudadanos',
        loadChildren: () => import('./ciudadanos/ciudadanos.module.routes').then(m => m.CIUDADANOS_RUTAS),
    },
    {
        path: 'solicitudes',
        loadChildren: () => import('./solicitudes/solicitudes.module.routes').then(m => m.SOLICITUDES_RUTAS),
    },
       
];