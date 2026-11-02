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


% Entradas: ninguna.
% Salidas: Objeto y Lugar donde se encontraba.
% Restricciones: Objeto debe estar definido en objeto/1 y Lugar en lugar/2.
% Objetivo: establecer donde se encontraba cada objeto del caso.

ubicado(tarjeta_admin, administracion).
ubicado(llave_reactor, seguridad).
ubicado(kit_reparacion, almacen).
ubicado(tablet_camaras, seguridad).
ubicado(escaner_medico, enfermeria).
ubicado(bidon_combustible, motores).


% Entradas: ninguna.
% Salidas: Persona y Lugar al que tiene acceso directo.
% Restricciones: Persona debe estar definida en persona/1 y Lugar en lugar/2.
% Objetivo: registrar los accesos directos de cada tripulante a las salas de la nave.

acceso(leonel, cafeteria).
acceso(leonel, navegacion).
acceso(leonel, comunicaciones).
acceso(david, cafeteria).
acceso(david, seguridad).
acceso(jordan, cafeteria).
acceso(jordan, electricidad).
acceso(jordan, motores).
acceso(diego, cafeteria).
acceso(diego, enfermeria).
acceso(jeremy, cafeteria).
acceso(jeremy, administracion).
acceso(jeremy, comunicaciones).
acceso(josimar, cafeteria).
acceso(josimar, almacen).
acceso(josimar, motores).
acceso(melany, cafeteria).
acceso(melany, electricidad).
acceso(melany, almacen).
acceso(ronaldo, cafeteria).
acceso(ronaldo, reactor).
acceso(ronaldo, motores).
acceso(tiffany, cafeteria).
acceso(tiffany, enfermeria).
acceso(tiffany, administracion).
acceso(cristian, cafeteria).
acceso(cristian, seguridad).
acceso(cristian, navegacion).
