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


% Entradas: Hora en formato HHMM.
% Salidas: Texto con la hora en formato HH:MM.
% Restricciones: Hora debe ser un entero.
% Objetivo: presentar una hora HHMM de forma legible.

formato_hora(Hora, Texto) :-
    Horas is Hora // 100,
    Minutos is Hora mod 100,
    format(atom(Texto), '~|~`0t~d~2+:~|~`0t~d~2+', [Horas, Minutos]).
    % "~|~`0t~d~2+:~|~`0t~d~2+" es un formato de cadena que asegura que la hora y los minutos tengan siempre dos dígitos, rellenando con ceros a la izquierda si es necesario.


% Entradas: una lista de elementos.
% Salidas: ninguna (imprime cada elemento precedido por un guion).
% Restricciones: la lista puede estar vacia.
% Objetivo: mostrar listas sencillas con un elemento por linea.

mostrar_elementos_lista(Lista) :-
    forall(member(Elemento, Lista),
           format('- ~w~n', [Elemento])).


% Entradas: lista de textos y una variable para el resultado.
% Salidas: lista de textos con guiones y separados por saltos de línea.
% Restricciones: los textos deben ser cadenas.
% Objetivo: presentar los indicios como una lista legible.

detalles_en_lista(Textos, Detalles) :-
    include(detalle_con_contenido, Textos, TextosNoVacios),
    maplist(detalle_con_guion, TextosNoVacios, Lineas),
    atomic_list_concat(Lineas, '\n', Detalles).


% Entradas: un texto.
% Salidas: verdadero si el texto no está vacío.
% Restricciones: el texto debe ser una cadena.
% Objetivo: verificar que un texto tenga contenido.

detalle_con_contenido(Texto) :-
    string_length(Texto, Longitud),
    Longitud > 0.


% Entradas: un texto y una variable para el resultado.
% Salidas: el texto con un guion al inicio.
% Restricciones: el texto debe ser una cadena.
% Objetivo: agregar un guion al inicio de un texto para presentarlo como un elemento de una lista.

detalle_con_guion(Texto, Linea) :-
    format(string(Linea), "- ~w", [Texto]).


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: si no hay evento o hay mas de uno se indica en el texto.
% Objetivo: mostrar el evento central del caso con su lugar y hora.

mostrar_evento :-
    (   evento_central(Nombre, Lugar, Hora)
    ->  formato_hora(Hora, Texto),
        format('Evento central: ~w en ~w.~n', [Nombre, Lugar]),
        format('Hora del evento: ~w~n', [Texto])
    ;   evento(_, _, _)
    ->  writeln('  El caso tiene mas de un evento; debe existir un unico evento central.')
    ;   writeln('  No hay evento registrado.')
    ).


% Entradas: Hora en formato HHMM.
% Salidas: Minutos transcurridos desde las 12:00 media noche.
% Restricciones: Hora debe ser un entero en formato HHMM.
% Objetivos: convertir una hora en formato HHMM a minutos para facilitar comparaciones de tiempo.

hora_a_minutos(Hora, Minutos) :-
    Minutos is (Hora // 100) * 60 + (Hora mod 100).
    % Horas en minutos + minutos restantes de la hora.


% Entradas: HoraEvento en formato HHMM.
% Salidas: Inicio y Fin en formato HHMM que representan el intervalo de 30 minutos antes y después del evento.
% Restricciones: HoraEvento debe ser un entero en formato HHMM.
% Objetivo: calcular el intervalo de tiempo alrededor del evento para determinar la presencia de personas.

rango_horas_alrededor_evento(HoraEvento, MinutosAntes, MinutosDespues, Inicio, Fin) :-
    hora_a_minutos(HoraEvento, EventoMinutos),
    % 1440 es el número total de minutos en un día. Se suma para evitar valores negativos y luego se 
    % aplica mod 1440 para mantener el resultado dentro del rango de un día.
    InicioMinutos is (EventoMinutos - MinutosAntes + 1440) mod 1440,
    FinMinutos is (EventoMinutos + MinutosDespues) mod 1440,
    minutos_a_hora(InicioMinutos, Inicio),
    minutos_a_hora(FinMinutos, Fin).


% Entradas: Minutos (numero).
% Salidas: Hora en formato HHMM.
% Restricciones: Minutos debe ser un entero no negativo.
% Objetivo: convertir minutos transcurridos desde la medianoche a una hora en formato HHMM para facilitar la presentación de resultados.

minutos_a_hora(Minutos, Hora) :-
    Horas is Minutos // 60,
    MinutosHora is Minutos mod 60,
    Hora is Horas * 100 + MinutosHora.
