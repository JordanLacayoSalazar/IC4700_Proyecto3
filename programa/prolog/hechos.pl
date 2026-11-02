% Entradas: ninguna.
% Salidas: Nombre de cada persona relacionada con el caso.
% Restricciones: Nombre debe ser un atomo unico.
% Objetivo: definir los tripulantes que forman parte del caso.

persona(leonel).
persona(david).
persona(jordan).
persona(diego).
persona(jeremy).
persona(josimar).
persona(melany).
persona(ronaldo).
persona(tiffany).
persona(cristian).


% Entradas: ninguna.
% Salidas: Nombre del lugar y su Descripcion.
% Restricciones: Nombre debe ser un atomo unico; Descripcion debe ser un string.
% Objetivo: definir las salas de la nave relevantes para la investigacion.

lugar(cafeteria, "Cafeteria central de la nave, punto de reunion de la tripulacion.").
lugar(administracion, "Sala de administracion con el mapa general de la nave.").
lugar(electricidad, "Sala electrica que controla la energia y las luces.").
lugar(enfermeria, "Enfermeria con el escaner medico.").
lugar(seguridad, "Sala de seguridad con los monitores de las camaras.").
lugar(reactor, "Reactor principal que mantiene la nave en funcionamiento.").
lugar(motores, "Sala de motores superior e inferior.").
lugar(navegacion, "Cabina de navegacion desde donde se dirige la nave.").
lugar(comunicaciones, "Sala de comunicaciones con la antena de la nave.").
lugar(almacen, "Almacen de carga y suministros.").


% Entradas: ninguna.
% Salidas: Objeto relevante para el caso.
% Restricciones: Objeto debe ser un atomo unico.
% Objetivo: definir los objetos relevantes para la investigacion.

objeto(tarjeta_admin).
objeto(llave_reactor).
objeto(kit_reparacion).
objeto(tablet_camaras).
objeto(escaner_medico).
objeto(bidon_combustible).
