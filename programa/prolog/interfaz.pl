% Contiene los predicados que se utilizan en la aplicación final (con interfaz gráfica).
% Se encargan de consultar los hechos del caso y presentarlos en un formato legible para el backend.

% Entradas: ninguna.
% Salidas: cantidad de personas en la primera linea y sus nombres en las siguientes.
% Restricciones: ninguna.
% Objetivo: proporcionar al backend la lista de personas en el caso.

interfaz_consultar_personas :-
    findall(Persona, persona(Persona), Personas),
    length(Personas, Cantidad),
    writeln(Cantidad),
    forall(member(Persona, Personas), writeln(Persona)).


% Entradas: ninguna.
% Salidas: cantidad de lugares en la primera linea y luego una linea por lugar,
%          con su nombre, descripcion y personas con acceso separados por |.
%          Las personas se separan por comas.
% Restricciones: solo se incluyen lugares definidos mediante lugar/2 y personas
%                cuyo acceso se cumple mediante tiene_acceso/2. Si un lugar no
%                tiene personas con acceso, se deja vacio el campo de personas.
% Objetivo: proporcionar al backend los lugares del caso y las personas autorizadas
%           para ingresar a cada uno.

interfaz_consultar_lugares :-
    findall(Lugar-Descripcion, lugar(Lugar, Descripcion), Lugares),
    length(Lugares, Cantidad),
    writeln(Cantidad),
    forall(
        member(Lugar-Descripcion, Lugares),
        (   findall(Persona, tiene_acceso(Persona, Lugar), PersonasConAcceso),
            sort(PersonasConAcceso, PersonasOrdenadas),
            atomic_list_concat(PersonasOrdenadas, ',', TextoPersonas),
            format('~w|~s|~w~n', [Lugar, Descripcion, TextoPersonas])
        )
    ).


% Entradas: ninguna.
% Salidas: cantidad de objetos en la primera linea y luego una linea por objeto,
%          con el objeto, lugares a los que permite acceder y lugares donde se encuentra,
%          separados por |. Las listas se separan por comas.
% Restricciones: solo se incluyen objetos definidos mediante objeto/1 y sus relaciones
%                definidas mediante accesoPorObjeto/2 y ubicado/2.
% Objetivo: proporcionar al backend los objetos, sus accesos condicionados y ubicaciones.

interfaz_consultar_objetos :-
    findall(Objeto, objeto(Objeto), Objetos),
    length(Objetos, Cantidad),
    writeln(Cantidad),
    forall(
        member(Objeto, Objetos),
        (   findall(LugarAcceso, accesoPorObjeto(LugarAcceso, Objeto), LugaresAcceso),
            sort(LugaresAcceso, LugaresAccesoOrdenados),
            atomic_list_concat(LugaresAccesoOrdenados, ',', TextoLugaresAcceso),
            findall(LugarUbicacion, ubicado(Objeto, LugarUbicacion), LugaresUbicacion),
            sort(LugaresUbicacion, LugaresUbicacionOrdenados),
            atomic_list_concat(LugaresUbicacionOrdenados, ',', TextoLugaresUbicacion),
            format('~w|~w|~w~n', [Objeto, TextoLugaresAcceso, TextoLugaresUbicacion])
        )
    ).


% Entradas: ninguna.
% Salidas: cantidad de evidencias en la primera linea y luego una linea por evidencia,
%          con evidencia, lugar, hora y personas relacionadas separados por |.
%          Las personas se separan por comas. El campo queda vacio si no hay correspondencia.
% Restricciones: solo se incluyen hechos evidencia/3 y sus relaciones corresponde/2.
% Objetivo: proporcionar las evidencias del caso y las personas relacionadas con cada una.

interfaz_consultar_evidencias :-
    findall([Evidencia, Lugar, Hora], evidencia(Evidencia, Lugar, Hora), Evidencias),
    length(Evidencias, Cantidad),
    writeln(Cantidad),
    forall(
        member([Evidencia, Lugar, Hora], Evidencias),
        (   findall(Persona, corresponde(Evidencia, Persona), PersonasRelacionadas),
            sort(PersonasRelacionadas, PersonasOrdenadas),
            atomic_list_concat(PersonasOrdenadas, ',', TextoPersonas),
            formato_hora(Hora, TextoHora),
            format('~w|~w|~w|~w~n', [Evidencia, Lugar, TextoHora, TextoPersonas])
        )
    ).


% Entradas: ninguna.
% Salidas: cantidad de movimientos en la primera linea y luego una linea por cada
%          hecho estuvo/3 con persona y "Estuvo en <lugar> a las <hora>" separados por |.
% Restricciones: no se agrupan los registros por persona.
% Objetivo: proporcionar al backend todos los movimientos del caso.

interfaz_consultar_movimientos :-
    findall(Persona-Lugar-Hora, estuvo(Persona, Lugar, Hora), Movimientos),
    length(Movimientos, Cantidad),
    writeln(Cantidad),
    forall(
        member(Persona-Lugar-Hora, Movimientos),
        (   formato_hora(Hora, TextoHora),
            format('~w|Estuvo en ~w a las ~w~n', [Persona, Lugar, TextoHora])
        )
    ).


% Entradas: ninguna.
% Salidas: cantidad de testimonios en la primera linea y luego una linea por cada
%          hecho testimonio/3 con persona y texto separados por |.
% Restricciones: no se agrupan los registros por persona.
% Objetivo: proporcionar al backend todos los testimonios del caso.

interfaz_consultar_testimonios :-
    findall(Persona-Lugar-Hora, testimonio(Persona, Lugar, Hora), Testimonios),
    length(Testimonios, Cantidad),
    writeln(Cantidad),
    forall(
        member(Persona-Lugar-Hora, Testimonios),
        (   formato_hora(Hora, TextoHora),
            format('~w|Declaró que estuvo en ~w a las ~w~n', [Persona, Lugar, TextoHora])
        )
    ).


% Entradas: Persona, un atomo definido mediante persona/1.
% Salidas: explicaciones logicas para la persona, sin mensajes interactivos de consola.
% Restricciones: si no hay explicaciones disponibles, se informa en la salida.
% Objetivo: proporcionar al backend las explicaciones en un formato listo para la interfaz.

interfaz_generar_explicaciones(Persona) :-
    (   validar_persona_interfaz(
            Persona,
            'Debe indicar una persona para generar explicaciones.'
        )
    ->  findall(Explicacion, explicaciones(Persona, Explicacion), Explicaciones),
        (   Explicaciones == []
        ->  format('No hay explicaciones disponibles para ~w.~n', [Persona])
        ;   format('Explicaciones para ~w:~n', [Persona]),
            forall(member(Explicacion, Explicaciones), format('~s~n', [Explicacion]))
        )
    ;   true
    ).


% Entradas: Persona, un atomo definido mediante persona/1.
% Salidas: informacion de investigacion individual para la persona.
% Restricciones: investigar/1 informa si la persona no existe.
% Objetivo: exponer la investigacion individual a la interfaz grafica.

interfaz_investigar_persona(Persona) :-
    (   validar_persona_interfaz(Persona, 'Error: Debe indicar una persona para investigar.')
    ->  investigar(Persona)
    ;   true
    ).


% Entradas: Persona, Lugar y Hora como número en formato HHMM.
% Salidas: mensaje con el movimiento encontrado o con el motivo por el que no se pudo consultar.
% Restricciones: Persona y Lugar deben estar registrados; Hora debe ser un número entero válido en formato HHMM.
% Objetivo: validar los argumentos de la consulta gráfica y delegar la búsqueda del movimiento.

interfaz_consultar_estadia(Persona, Lugar, HoraEntrada) :-
    (   validar_persona_interfaz(Persona, 'Error: Debe indicar una persona.'),
        validar_lugar_interfaz(Lugar, 'Error: Debe indicar un lugar.'),
        validar_hora_interfaz(
            HoraEntrada,
            'Error: Debe indicar una hora.',
            'La hora no es valida. Use el formato HHMM. Asegúrese de ingresar horas y minutos reales. Por ejemplo: 1960 no existe.'
        )
    ->  resultado_estadia(Persona, Lugar, HoraEntrada, Resultado),
        formato_hora(HoraEntrada, TextoHora),
        mostrar_resultado_estadia(Resultado, Persona, Lugar, TextoHora)
    ;   true
    ).

% Entradas: Persona, Lugar, Inicio y Fin; las horas se reciben como números HHMM.
% Salidas: movimientos encontrados en el intervalo inclusivo o un mensaje con el error de validación.
% Restricciones: Persona y Lugar deben estar registrados, las horas deben ser válidas y el inicio no puede superar el fin.
% Objetivo: validar los argumentos del frontend y delegar la búsqueda de movimientos.

interfaz_consultar_intervalo(Persona, Lugar, Inicio, Fin) :-
    (   validar_persona_interfaz(Persona, 'Error: Debe indicar una persona.'),
        validar_lugar_interfaz(Lugar, 'Error: Debe indicar un lugar.'),
        validar_hora_interfaz(
            Inicio,
            'Error: Debe indicar una hora inicial.',
            'La hora inicial no es valida. Use el formato HHMM. Asegúrese de ingresar horas y minutos reales. Por ejemplo: 1960 no existe.'
        ),
        validar_hora_interfaz(
            Fin,
            'Error: Debe indicar una hora final.',
            'La hora final no es valida. Use el formato HHMM. Asegúrese de ingresar horas y minutos reales. Por ejemplo: 1960 no existe.'
        )
    ->  (   Inicio > Fin
        ->  writeln('La hora inicial no puede ser mayor que la hora final.')
        ;   movimientos_en_intervalo(Persona, Lugar, Inicio, Fin, Movimientos),
            mostrar_movimientos_persona_intervalo(Persona, Lugar, Movimientos)
        )
    ;   true
    ).

% Entradas: Persona y el mensaje que se debe mostrar si no se proporcionó.
% Salidas: tiene éxito si Persona es un átomo registrado. En caso contrario, muestra el error.
% Restricciones: Persona debe ser un átomo definido mediante persona/1.
% Objetivo: centralizar la validación de personas para las consultas del frontend.

validar_persona_interfaz(Persona, MensajeFaltante) :-
    (   var(Persona)
    ->  writeln(MensajeFaltante),
        fail
    ;   Persona == ""
    ->  writeln(MensajeFaltante),
        fail
    ;   \+ atom(Persona)
    ->  writeln('Error: La persona debe ser un atomo.'),
        fail
    ;   \+ persona(Persona)
    ->  format('La persona ~w no esta registrada en el caso.~n', [Persona]),
        fail
    ;   true
    ).


% Entradas: Lugar y el mensaje que se debe mostrar si no se proporcionó.
% Salidas: tiene éxito si Lugar es un átomo registrado. En caso contrario, muestra el error.
% Restricciones: Lugar debe ser un átomo definido mediante lugar/2.
% Objetivo: centralizar la validación de lugares para las consultas del frontend.

validar_lugar_interfaz(Lugar, MensajeFaltante) :-
    (   var(Lugar)
    ->  writeln(MensajeFaltante),
        fail
    ;   Lugar == ""
    ->  writeln(MensajeFaltante),
        fail
    ;   \+ atom(Lugar)
    ->  writeln('Error: El lugar debe ser un atomo.'),
        fail
    ;   \+ lugar(Lugar, _)
    ->  format('El lugar ~w no esta registrado en el caso.~n', [Lugar]),
        fail
    ;   true
    ).


% Entradas: Hora numérica, mensaje para dato faltante y mensaje para formato inválido.
% Salidas: tiene éxito si Hora es un número entero válido en formato HHMM.
% Restricciones: Hora debe cumplir hora_valida/1.
% Objetivo: validar las horas numéricas recibidas desde la interfaz gráfica.

validar_hora_interfaz(Hora, MensajeFaltante, MensajeInvalido) :-
    (   var(Hora)
    ->  writeln(MensajeFaltante),
        fail
    ;   Hora == ""
    ->  writeln(MensajeFaltante),
        fail
    ;   number(Hora),
        hora_valida(Hora)
    ->  true
    ;   writeln(MensajeInvalido),
        fail
    ).
