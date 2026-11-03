% Entradas: ninguna.
% Salidas: ninguna.
% Restricciones: ninguna.
% Objetivo: permitir que las reglas fallen sin error cuando un caso no define hechos opcionales.

:- dynamic ubicado/2, accesoPorObjeto/2, evidencia/3, corresponde/2, testimonio/3.


% Entradas: Hora (numero).
% Salidas: verdadero si la Hora respeta el formato HHMM.
% Restricciones: las horas deben estar entre 00 y 23 y los minutos entre 00 y 59.
% Objetivo: validar que una hora del caso o digitada por el usuario tenga el formato HHMM.

hora_valida(Hora) :-
    integer(Hora),
    Horas is Hora // 100,
    Minutos is Hora mod 100,
    Horas >= 0, Horas =< 23,
    Minutos >= 0, Minutos =< 59.


% Entradas: Nombre, Lugar y Hora (pueden ser variables).
% Salidas: verdadero si el caso contiene exactamente un evento, unificando sus datos.
% Restricciones: falla si el caso no tiene eventos o tiene mas de uno.
% Objetivo: obtener el evento central del caso garantizando que sea unico.

evento_central(Nombre, Lugar, Hora) :-
    findall(N-L-H, evento(N, L, H), [Nombre-Lugar-Hora]).


% Entradas: Persona y Objeto (pueden ser variables).
% Salidas: verdadero si la Persona puede obtener el Objeto.
% Restricciones: el objeto debe tener una ubicacion registrada en ubicado/2; la segunda clausula solo aplica sin acceso directo, para no repetir soluciones.
% Objetivo: determinar si una persona puede tomar un objeto por tener acceso directo al lugar donde se encontraba o por haber estado registrada alli.

puede_obtener_objeto(Persona, Objeto) :-
    ubicado(Objeto, LugarObjeto),
    acceso(Persona, LugarObjeto).
puede_obtener_objeto(Persona, Objeto) :-
    ubicado(Objeto, LugarObjeto),
    persona(Persona),
    \+ acceso(Persona, LugarObjeto),
    once(estuvo(Persona, LugarObjeto, _)).


% Entradas: Persona, Lugar y Objeto (pueden ser variables).
% Salidas: verdadero si la Persona puede ingresar al Lugar usando el Objeto.
% Restricciones: el lugar debe estar condicionado en accesoPorObjeto/2.
% Objetivo: determinar el acceso a un lugar condicionado por un objeto que la persona puede obtener.

acceso_mediante_objeto(Persona, Lugar, Objeto) :-
    accesoPorObjeto(Lugar, Objeto),
    puede_obtener_objeto(Persona, Objeto).


% Entradas: Persona y Lugar (pueden ser variables).
% Salidas: verdadero si la Persona puede ingresar al Lugar.
% Restricciones: el acceso por objeto solo se considera cuando no existe acceso directo, para no repetir soluciones.
% Objetivo: determinar si una persona tiene autorizacion para ingresar a un lugar, ya sea directa o mediante un objeto.

tiene_acceso(Persona, Lugar) :-
    acceso(Persona, Lugar).
tiene_acceso(Persona, Lugar) :-
    acceso_mediante_objeto(Persona, Lugar, _),
    \+ acceso(Persona, Lugar).
