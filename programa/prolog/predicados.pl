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


% Entradas: Persona, Lugar, Inicio y Fin (pueden ser variables).
% Salidas: verdadero si la Persona estuvo en el Lugar dentro del intervalo indicado.
% Restricciones: Inicio y Fin deben ser horas validas en formato HHMM y el intervalo es inclusivo; Inicio no puede ser mayor que Fin.
% Objetivo: consultar los movimientos de una persona registrados durante un intervalo de tiempo.

estuvo_en_intervalo(Persona, Lugar, Inicio, Fin) :-
    hora_valida(Inicio),
    hora_valida(Fin),
    Inicio =< Fin,
    estuvo(Persona, Lugar, Hora),
    hora_valida(Hora),
    Hora >= Inicio,
    Hora =< Fin.


% Entradas: Persona y una variable para la lista de evidencias.
% Salidas: Lista ordenada sin duplicados de las evidencias relacionadas con la Persona.
% Restricciones: Persona debe estar definida mediante persona/1; la lista puede estar vacia.
% Objetivo: reunir las evidencias asociadas a una persona mediante corresponde/2.

evidencias_de(Persona, Evidencias) :-
    persona(Persona),
    findall(Evidencia, corresponde(Evidencia, Persona), ListaEvidencias),
    sort(ListaEvidencias, Evidencias).


% Entradas: Persona (puede ser variable).
% Salidas: verdadero si existe una posible coartada corroborada para la Persona.
% Restricciones: debe existir un unico evento; un testimonio y un movimiento deben ubicar a la Persona en el mismo lugar y hora del evento, en un lugar distinto al evento.
% Objetivo: inferir una posible coartada relacionando testimonios, movimientos y el momento y lugar del evento.

tiene_coartada(Persona) :-
    evento_central(_, LugarEvento, HoraEvento),
    hora_valida(HoraEvento),
    testimonio(Persona, LugarTestimonio, HoraEvento),
    LugarTestimonio \= LugarEvento,
    estuvo(Persona, LugarTestimonio, HoraEvento).


% Entradas: Persona (puede ser variable).
% Salidas: verdadero si existe una diferencia entre un testimonio y un movimiento de la Persona.
% Restricciones: la hora del testimonio debe ser valida y ambas fuentes deben ubicar a la Persona en lugares distintos durante la misma hora.
% Objetivo: inferir contradicciones comparando los testimonios y los movimientos registrados, sin almacenar una conclusion explicita.

tiene_contradiccion(Persona) :-
    contradiccion_de(Persona, _, _, _).


% Entradas: Persona, Hora, LugarTestimonio y LugarMovimiento (pueden ser variables).
% Salidas: una contradiccion encontrada entre el lugar declarado y el lugar registrado para la Persona.
% Restricciones: Persona debe estar definida mediante persona/1; Hora debe ser valida; los lugares deben ser distintos.
% Objetivo: identificar y describir una contradiccion entre testimonio/3 y estuvo/3.

contradiccion_de(Persona, Hora, LugarTestimonio, LugarMovimiento) :-
    persona(Persona),
    testimonio(Persona, LugarTestimonio, Hora),
    hora_valida(Hora),
    estuvo(Persona, LugarMovimiento, Hora),
    LugarTestimonio \= LugarMovimiento.


% Entradas: Persona (puede ser variable).
% Salidas: verdadero si la Persona tiene acceso al lugar del evento y al menos un indicio relacionado con este.
% Restricciones: debe existir un unico evento; el indicio debe ser presencia en el lugar a la hora del evento, evidencia atribuida hallada en ese lugar o contradiccion a la hora del evento.
% Objetivo: inferir posibles sospechosos mediante la combinacion de accesos, movimientos, evidencias y contradicciones relevantes.

posible_sospechoso(Persona) :-
    persona(Persona),
    evento_central(_, LugarEvento, HoraEvento),
    hora_valida(HoraEvento),
    tiene_acceso(Persona, LugarEvento),
    once((  estuvo(Persona, LugarEvento, HoraEvento)
         ;  evidencia_en_evento(Persona, LugarEvento, _, _)
         ;  contradiccion_de(Persona, HoraEvento, _, _)
         )).


% Entradas: Persona, Lugar del evento y variables para la evidencia y su hora.
% Salidas: verdadero si una evidencia encontrada en el Lugar esta relacionada con la Persona.
% Restricciones: la evidencia debe estar registrada mediante evidencia/3 y corresponde/2.
% Objetivo: relacionar evidencias encontradas en el lugar del evento con una persona investigada.

evidencia_en_evento(Persona, LugarEvento, Evidencia, HoraEvidencia) :-
    evidencia(Evidencia, LugarEvento, HoraEvidencia),
    hora_valida(HoraEvidencia),
    corresponde(Evidencia, Persona).


% Entradas: Persona (puede ser variable).
% Salidas: verdadero si la Persona puede descartarse como posible responsable segun las reglas del caso.
% Restricciones: debe existir un unico evento y una coartada corroborada; la Persona no debe tener acceso ni presencia en el lugar del evento, evidencia atribuida hallada alli ni contradiccion a la hora del evento.
% Objetivo: justificar el descarte mediante testimonios, movimientos, accesos, evidencias y contradicciones relevantes.

descartar(Persona) :-
    persona(Persona),
    evento_central(_, LugarEvento, HoraEvento),
    hora_valida(HoraEvento),
    tiene_coartada(Persona),
    \+ tiene_acceso(Persona, LugarEvento),
    \+ estuvo(Persona, LugarEvento, HoraEvento),
    \+ evidencia_en_evento(Persona, LugarEvento, _, _),
    \+ contradiccion_de(Persona, HoraEvento, _, _).


% Entradas: Una variable para la lista de posibles responsables.
% Salidas: Lista ordenada sin duplicados de las personas que cumplen posible_sospechoso/1.
% Restricciones: solo se consideran personas definidas mediante persona/1; la lista puede estar vacia.
% Objetivo: reunir las personas que cumplen las condiciones logicas establecidas para ser posibles responsables.

posibles_responsables(Lista) :-
    findall(Persona,
            ( persona(Persona),
              posible_sospechoso(Persona) ),
            ListaPersonas),
    sort(ListaPersonas, Lista).


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
