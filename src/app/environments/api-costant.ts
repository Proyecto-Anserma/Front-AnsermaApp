import { environment } from "./environment";

const PORT = environment.PORT;

export const CIUDADANO = {
    CONSULTAR_CIUDADANOS: PORT+"/consultar-ciudadanos",
    EDITAR_CIUDAD: PORT+"/editar-ciudadano"
};

export const SOLICITUD = {
    CONSULTAR_SOLICITUDES: PORT+"/consultar-solicitudes"
};

export const USUARIO = {
    CONSULTAR_USUARIOS: PORT+"/consultar-usuarios"
};