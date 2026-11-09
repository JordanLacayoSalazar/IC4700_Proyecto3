% Entradas: ninguna.
% Salidas: ninguna.
% Restricciones: ninguna.
% Objetivo: permitir que las reglas fallen sin error cuando un caso no define hechos opcionales.

:- dynamic ubicado/2, accesoPorObjeto/2, evidencia/3, corresponde/2, testimonio/3.


% Entradas: Persona, Lugar, Inicio y Fin (pueden ser variables).
% Salidas: verdadero si la Persona estuvo en el Lugar dentro del intervalo indicado.
% Restricciones: Inicio y Fin deben ser horas validas en formato HHMM y el intervalo es inclusivo; Inicio no puede ser mayor que Fin.
% Objetivo: consultar los movimientos de una persona registrados durante un intervalo de tiempo.

estuvo_en_intervalo(Persona, Lugar, Inicio, Fin) :-
    estuvo(Persona, Lugar, Hora),
    hora_en_intervalo(Hora, Inicio, Fin).


% Entradas: Hora, Inicio y Fin en formato HHMM.
% Salidas: verdadero si Hora cae dentro del intervalo inclusivo, incluso si cruza medianoche.
% Restricciones: las tres horas deben ser validas.
% Objetivo: comparar horas usando minutos transcurridos desde medianoche.
hora_en_intervalo(Hora, Inicio, Fin) :-
    hora_valida(Hora),
    hora_valida(Inicio),
    hora_valida(Fin),
    hora_a_minutos(Hora, HoraMinutos),
    hora_a_minutos(Inicio, InicioMinutos),
    hora_a_minutos(Fin, FinMinutos),
    (   InicioMinutos =< FinMinutos
    ->  HoraMinutos >= InicioMinutos,
        HoraMinutos =< FinMinutos
    ;   HoraMinutos >= InicioMinutos
    ;   HoraMinutos =< FinMinutos
    ).


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


% Entradas: Persona, LugarEvento, HoraEvento, HoraContradiccion, LugarTestimonio y LugarMovimiento (pueden ser variables).
% Salidas: verdadero si la Persona tiene acceso al lugar del evento y se contradice dentro de los 30 minutos
%          anteriores o posteriores, ubicandose en el evento solo en su testimonio o en los movimientos registrados.
% Restricciones: debe existir un unico evento; la hora del evento debe ser valida; el lugar del evento debe estar definido en lugar/2; la Persona debe estar definida mediante persona/1.
% Objetivo: identificar contradicciones que hacen que una persona sea considerada sospechosa.

contradiccion_sospechosa_de(Persona, LugarEvento, HoraEvento, HoraContradiccion, LugarTestimonio, LugarMovimiento) :-
    tiene_acceso(Persona, LugarEvento),
    rango_horas_alrededor_evento(HoraEvento, 30, 30, HoraInicio, HoraFin),
    contradiccion_de(Persona, HoraContradiccion, LugarTestimonio, LugarMovimiento),
    (   LugarTestimonio = LugarEvento
    ;   LugarMovimiento = LugarEvento
    ),
    hora_en_intervalo(HoraContradiccion, HoraInicio, HoraFin).


% Entradas: Persona, LugarEvento, HoraEvento, HoraContradiccion, LugarTestimonio y LugarMovimiento (pueden ser variables).
% Salidas: verdadero si la Persona tiene acceso al lugar del evento y se contradice dentro de los 30 minutos
%          anteriores o posteriores, con ambos lugares fuera del lugar del evento.
% Restricciones: Persona debe estar definida mediante persona/1 y los lugares del testimonio y movimiento deben ser distintos entre sí y del lugar del evento.
% Objetivo: identificar contradicciones relacionadas temporalmente con el evento que no cumplen el criterio de sospechoso por lugar.

contradiccion_relevante_de(Persona, LugarEvento, HoraEvento, HoraContradiccion, LugarTestimonio, LugarMovimiento) :-
    rango_horas_alrededor_evento(HoraEvento, 30, 30, HoraInicio, HoraFin),
    contradiccion_de(Persona, HoraContradiccion, LugarTestimonio, LugarMovimiento),
    LugarTestimonio \= LugarEvento,
    LugarMovimiento \= LugarEvento,
    hora_en_intervalo(HoraContradiccion, HoraInicio, HoraFin).


% Entradas: Persona (puede ser variable).
% Salidas: verdadero si la Persona tiene acceso al lugar del evento y al menos un indicio relacionado con este.
% Restricciones: debe existir un unico evento; el indicio debe ser presencia en el lugar a la hora del evento, evidencia atribuida hallada en ese lugar o una contradiccion dentro de los 30 minutos anteriores o posteriores en la que el testimonio o el movimiento ubique a la Persona en el lugar del evento.
% Objetivo: inferir posibles sospechosos mediante la combinacion de accesos, movimientos, evidencias y contradicciones relevantes.

posible_sospechoso(Persona) :-
    persona(Persona),
    evento_central(_, LugarEvento, HoraEvento),
    hora_valida(HoraEvento),
    tiene_acceso(Persona, LugarEvento),
    once((  estuvo(Persona, LugarEvento, HoraEvento)
         ;  evidencia_en_evento(Persona, LugarEvento, _, _)
         ;  contradiccion_sospechosa_de(Persona, LugarEvento, HoraEvento, _, _, _)
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
% Restricciones: debe existir un unico evento y una coartada corroborada; la Persona no debe tener acceso ni presencia en el lugar del evento, evidencia atribuida hallada alli ni contradicciones en sus declaraciones.
% Objetivo: justificar el descarte mediante testimonios, movimientos, accesos, evidencias y contradicciones relevantes.

descartar(Persona) :-
    persona(Persona),
    evento_central(_, LugarEvento, HoraEvento),
    hora_valida(HoraEvento),
    tiene_coartada(Persona),
    \+ tiene_acceso(Persona, LugarEvento),
    \+ estuvo(Persona, LugarEvento, HoraEvento),
    \+ evidencia_en_evento(Persona, LugarEvento, _, _),
    \+ tiene_contradiccion(Persona).


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


% Entradas: Persona y Explicacion (pueden ser variables).
% Salidas: verdadero si se puede generar una explicacion.
% Restricciones: la Persona debe estar definida mediante persona/1; la Explicacion será una cadena de texto.
% Objetivo: generar una explicacion que permita justificar por qué una persona puede ser considerada sospechosa, descartada o relevante.

% Explicacion de sospechoso: presencia y evidencias
% Es sospechoso si tiene acceso al lugar del evento y: estuvo alli a la hora del evento o tiene evidencias relacionadas o presenta contradicciones sospechosas en sus declaraciones.
explicaciones(Persona, Explicacion) :-
    posible_sospechoso(Persona),
    evento_central(_, LugarEvento, HoraEvento),

    findall(Hora,
        estuvo(Persona, LugarEvento, HoraEvento),
        Movimientos),

    findall(Hora,
        testimonio(Persona, LugarEvento, HoraEvento),
        Testimonios),

    findall(Evidencia,
        evidencia_en_evento(Persona, LugarEvento, Evidencia, _),
        Evidencias),

    findall(contradiccion(Hora, LugarTestimonio, LugarMovimiento),
        contradiccion_sospechosa_de(
            Persona, LugarEvento, HoraEvento, Hora,
            LugarTestimonio, LugarMovimiento),
        Contradicciones),

    movimiento_explicacion(Movimientos, TextoMovimientos),
    testimonio_explicacion(Testimonios, TextoTestimonios),
    evidencia_explicacion(Evidencias, TextoEvidencias),
    contradiccion_explicacion(Contradicciones, TextoContradicciones),

    detalles_en_lista(
        [TextoMovimientos, TextoTestimonios, TextoEvidencias,
         TextoContradicciones],
        Detalles),

    format(string(Explicacion),
        "~w es un(a) posible sospechoso(a) porque tenia acceso a ~w y presenta los siguientes indicios:~n~w",
        [Persona, LugarEvento, Detalles]).

% Explicacion de descarte
% Se descarta si tiene una coartada corroborada y no tiene acceso al lugar del evento, no estuvo alli a la hora del evento, no tiene evidencias relacionadas y no presenta contradicciones en sus declaraciones.
explicaciones(Persona, Explicacion) :-
    descartar(Persona),
    evento_central(_, LugarEvento, HoraEvento),
    formato_hora(HoraEvento, TextoHora),
    format(string(Explicacion),
        "~w fue descartado porque tiene una coartada, no tiene acceso al lugar del evento (~w), no existen registros de que estuviera alli a las ~w, no hay evidencias que lo relacionen con el evento y no presenta contradicciones en sus declaraciones.",
        [Persona, LugarEvento, TextoHora]).

% Explicacion de relevante
% Es relevante si no es sospechoso ni descartado, pero tiene algun indicio relacionado con el lugar del evento o se contradice pero no de forma sospechosa.
explicaciones(Persona, Explicacion) :-
    persona(Persona),
    \+ posible_sospechoso(Persona),
    \+ descartar(Persona),
    evento_central(_, LugarEvento, HoraEvento),

    findall(Hora,
        estuvo(Persona, LugarEvento, Hora),
        Movimientos),

    findall(Hora,
        testimonio(Persona, LugarEvento, Hora),
        Testimonios),

    findall(Evidencia,
        evidencia_en_evento(Persona, LugarEvento, Evidencia, _),
        Evidencias),

    findall(contradiccion(Hora, LugarTestimonio, LugarMovimiento),
        contradiccion_relevante_de(
            Persona, LugarEvento, HoraEvento, Hora,
            LugarTestimonio, LugarMovimiento),
        Contradicciones),

    (Movimientos \= []; Testimonios \= []; Evidencias \= []; Contradicciones \= []),

    movimiento_explicacion(Movimientos, TextoMovimientos),
    testimonio_explicacion(Testimonios, TextoTestimonios),
    evidencia_explicacion(Evidencias, TextoEvidencias),
    contradiccion_explicacion(Contradicciones, TextoContradicciones),
    (   tiene_acceso(Persona, LugarEvento)
    ->  format(string(TextoAccesoLugar),
            "Tiene acceso al lugar del evento (~w).",
            [LugarEvento])
    ;   TextoAccesoLugar = ""
    ),

    detalles_en_lista(
        [TextoAccesoLugar, TextoMovimientos, TextoTestimonios,
         TextoEvidencias, TextoContradicciones],
        Detalles),

    format(string(Explicacion),
        "~w es relevante para la investigacion por los siguientes indicios:~n~w",
        [Persona, Detalles]).


% Entradas: Contradicciones y Texto (pueden ser variables).
% Salidas: verdadero si se puede generar una explicacion de las contradicciones.
% Restricciones: la lista de contradicciones puede estar vacia; el Texto sera una cadena de texto.
% Objetivo: generar una explicacion de las contradicciones encontradas en las declaraciones de una persona, indicando la hora y los lugares involucrados.

contradiccion_explicacion([], "").
contradiccion_explicacion(Contradicciones, Texto) :-
    Contradicciones \= [],
    findall(Frase,
        (member(contradiccion(Hora, LugarTestimonio, LugarMovimiento),
                Contradicciones),
         formato_hora(Hora, HoraTexto),
         format(string(Frase),
            "Habia declarado estar en ~w a las ~w, pero los registros indican que estaba en ~w.",
            [LugarTestimonio, HoraTexto, LugarMovimiento])),
        Frases),
    atomic_list_concat(Frases, ' ', Texto).


% Entradas: Evidencias y Texto (pueden ser variables).
% Salidas: verdadero si se puede generar una explicacion de las evidencias.
% Restricciones: la lista de evidencias puede estar vacia; el Texto sera una cadena de texto.
% Objetivo: generar una explicacion que permita justificar la relacion de una persona con las evidencias encontradas en el lugar del evento.

evidencia_explicacion([], "").
evidencia_explicacion(Evidencias, Texto) :-
    Evidencias \= [],
    atomic_list_concat(Evidencias, ', ', ListaEvidencias),
    format(string(Texto),
        "Esta relacionado(a) con estas evidencias: ~w.",
        [ListaEvidencias]).


% Entradas: Testimonios y Texto (pueden ser variables).
% Salidas: verdadero si se puede generar una explicacion de los testimonios.
% Restricciones: la lista de testimonios puede estar vacia; el Texto sera una cadena de texto.
% Objetivo: generar una explicacion de los testimonios que dio sobre su ubicacion en el lugar del evento.

testimonio_explicacion([], "").
testimonio_explicacion(Horas, Texto) :-
    Horas \= [],
    maplist(formato_hora, Horas, HorasTexto),
    atomic_list_concat(HorasTexto, ', ', ListaHoras),
    format(string(Texto),
        "Habia declarado que estuvo en el lugar del evento a las ~w.",
        [ListaHoras]).


% Entradas: Movimientos y Texto (pueden ser variables).
% Salidas: verdadero si se puede generar una explicacion de los movimientos.
% Restricciones: la lista de movimientos puede estar vacia; el Texto sera una cadena de texto.
% Objetivo: generar una explicacion de los movimientos registrados en el lugar del evento.

movimiento_explicacion([], "").
movimiento_explicacion(Horas, Texto) :-
    Horas \= [],
    maplist(formato_hora, Horas, HorasTexto),
    atomic_list_concat(HorasTexto, ', ', ListaHoras),
    format(string(Texto),
        "Los registros indican que estuvo en el lugar del evento a las ~w.",
        [ListaHoras]).


% Entradas: una variable para el resultado de la resolucion.
% Salidas: error_evento, error_hora(Hora) o caso_resuelto(Personas, LugarEvento).
% Restricciones: solo se infieren responsables si existe un unico evento central con hora valida.
% Objetivo: obtener mediante inferencia logica el estado del caso y la lista de posibles responsables, sin presentar texto.

resolver_caso(Resultado) :-
    (   evento_central(_, LugarEvento, HoraEvento)
    ->  (   hora_valida(HoraEvento)
        ->  findall(Persona,
                    posible_sospechoso(Persona),
                    PersonasSinOrdenar),
            sort(PersonasSinOrdenar, Personas),
            Resultado = caso_resuelto(Personas, LugarEvento)
        ;   Resultado = error_hora(HoraEvento)
        )
    ;   Resultado = error_evento
    ).
