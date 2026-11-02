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


% Entradas: ninguna.
% Salidas: Lugar y Objeto necesario para ingresar a el.
% Restricciones: Lugar debe estar definido en lugar/2 y Objeto en objeto/1.
% Objetivo: registrar las salas cuyo acceso esta condicionado por un objeto.

accesoPorObjeto(reactor, llave_reactor).
accesoPorObjeto(electricidad, kit_reparacion).
accesoPorObjeto(comunicaciones, tarjeta_admin).


% Entradas: ninguna.
% Salidas: Persona, Lugar y Hora en que fue registrada.
% Restricciones: Persona debe estar definida en persona/1, Lugar en lugar/2 y Hora en formato HHMM.
% Objetivo: registrar los movimientos conocidos de cada tripulante dentro de la nave.

estuvo(leonel, cafeteria, 1900).
estuvo(leonel, navegacion, 1930).
estuvo(leonel, comunicaciones, 2000).
estuvo(david, cafeteria, 1900).
estuvo(david, seguridad, 1940).
estuvo(david, reactor, 1955).
estuvo(jordan, cafeteria, 1910).
estuvo(jordan, motores, 1945).
estuvo(jordan, motores, 2005).
estuvo(diego, cafeteria, 1900).
estuvo(diego, enfermeria, 1935).
estuvo(diego, enfermeria, 2010).
estuvo(jeremy, cafeteria, 1905).
estuvo(jeremy, administracion, 1930).
estuvo(jeremy, comunicaciones, 2000).
estuvo(josimar, cafeteria, 1900).
estuvo(josimar, almacen, 1940).
estuvo(josimar, electricidad, 1955).
estuvo(josimar, cafeteria, 2015).
estuvo(melany, cafeteria, 1910).
estuvo(melany, electricidad, 1930).
estuvo(melany, almacen, 2000).
estuvo(ronaldo, cafeteria, 1900).
estuvo(ronaldo, reactor, 1945).
estuvo(ronaldo, motores, 2000).
estuvo(tiffany, cafeteria, 1905).
estuvo(tiffany, enfermeria, 1940).
estuvo(tiffany, administracion, 2005).
estuvo(cristian, cafeteria, 1910).
estuvo(cristian, seguridad, 1935).
estuvo(cristian, navegacion, 1958).


% Entradas: ninguna.
% Salidas: Nombre del evento, Lugar y Hora en que ocurrio.
% Restricciones: debe existir un unico evento por caso; Lugar debe estar definido en lugar/2 y Hora en formato HHMM.
% Objetivo: definir el evento central que debe ser investigado.

evento(sabotaje, electricidad, 2000).
