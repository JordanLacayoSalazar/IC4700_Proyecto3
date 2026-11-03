% Entradas: ninguna.
% Salidas: Numero de la opcion, Texto a mostrar y Accion a ejecutar.
% Restricciones: Numero debe ser un entero unico; Accion debe ser un predicado de aridad 0. La opcion 0 se reserva para salir.
% Objetivo: definir las opciones disponibles en el menu principal.

opcion_menu(1, 'Consultar informacion del caso', opcion_consultar_caso).
opcion_menu(2, 'Investigar a una persona',       opcion_investigar).
opcion_menu(3, 'Obtener posibles responsables',  opcion_posibles_responsables).
opcion_menu(4, 'Generar explicaciones',          opcion_explicaciones).
opcion_menu(5, 'Resolver el caso',               opcion_resolver_caso).
opcion_menu(6, 'Consultar movimiento por hora',   opcion_consultar_estadia).
opcion_menu(7, 'Consultar movimientos por intervalo', opcion_consultar_intervalo).


% Entradas: ninguna.
% Salidas: ninguna (interaccion por consola).
% Restricciones: ninguna.
% Objetivo: arrancar el sistema mostrando la bienvenida y el menu.

iniciar :-
    nl,
    writeln('=============================================='),
    writeln('         ACADEMIA DETECTIVES'),
    writeln('   Sistema de investigacion logica de casos'),
    writeln('=============================================='),
    ciclo_menu.


% Entradas: ninguna.
% Salidas: ninguna.
% Restricciones: termina unicamente con la opcion 0 o fin de entrada.
% Objetivo: mostrar el menu, leer una opcion y ejecutarla, repitiendo hasta que el usuario elija salir.

ciclo_menu :-
    mostrar_menu,
    leer_opcion(Opcion),
    (   Opcion == 0
    ->  nl, writeln('Gracias por usar Academia Detectives. Hasta luego.')
    ;   ejecutar_opcion(Opcion),
        ciclo_menu
    ).


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: ninguna.
% Objetivo: imprimir todas las opciones definidas en opcion_menu/3.

mostrar_menu :-
    nl,
    writeln('---------------- MENU PRINCIPAL ----------------'),
    forall(opcion_menu(N, Texto, _),
           format('  ~w. ~w~n', [N, Texto])),
    writeln('  0. Salir'),
    writeln('------------------------------------------------'),
    write('Digite una opcion seguida de punto (ej: 1.): ').


% Entradas: termino Prolog digitado en consola.
% Salidas: Opcion leida; 0 si se alcanza el fin de la entrada; el atomo invalida si la entrada no es un termino valido.
% Restricciones: el usuario debe terminar la entrada con punto.
% Objetivo: leer la opcion digitada por el usuario.

leer_opcion(Opcion) :-
    catch(read(Entrada), _, Entrada = invalida),
    (   Entrada == end_of_file
    ->  Opcion = 0
    ;   Opcion = Entrada
    ).


% Entradas: Opcion digitada por el usuario.
% Salidas: ninguna (ejecuta la accion o muestra un error).
% Restricciones: si la opcion no existe se informa y se vuelve al menu.
% Objetivo: ejecutar la accion asociada a la opcion elegida.

ejecutar_opcion(Opcion) :-
    opcion_menu(Opcion, _, Accion), !,
    nl,
    catch(Accion, Error,
          ( print_message(error, Error),
            writeln('Ocurrio un error al ejecutar la consulta.') )).
ejecutar_opcion(_) :-
    nl,
    writeln('Opcion invalida. Intente de nuevo.').


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: ninguna.
% Objetivo: mostrar la informacion registrada del caso.

opcion_consultar_caso :-
    mostrar_evento,
    nl,
    mostrar_personas,
    nl,
    mostrar_lugares,
    nl,
    mostrar_objetos,
    nl,
    mostrar_evidencias.


% Entradas: ninguna (lee Persona, Lugar y Hora desde la consola).
% Salidas: ninguna (muestra si existe un movimiento coincidente).
% Restricciones: Persona y Lugar deben estar registrados; Hora debe ser valida en formato HHMM.
% Objetivo: consultar un movimiento puntual mediante el predicado estuvo/3.

opcion_consultar_estadia :-
    nl,
    writeln('Consultar movimiento por hora:'),
    leer_consulta('la persona', Persona),
    leer_consulta('el lugar', Lugar),
    leer_consulta('la hora en formato HHMM', Hora),
    (   (   Persona == fin_entrada
        ;   Lugar == fin_entrada
        ;   Hora == fin_entrada
        )
    ->  writeln('Consulta cancelada por fin de entrada.')
    ;   \+ atom(Persona)
    ->  writeln('La persona debe ser un atomo.')
    ;   \+ persona(Persona)
    ->  writeln('La persona no esta registrada en el caso.')
    ;   \+ atom(Lugar)
    ->  writeln('El lugar debe ser un atomo.')
    ;   \+ lugar(Lugar, _)
    ->  writeln('El lugar no esta registrado en el caso.')
    ;   \+ hora_valida(Hora)
    ->  writeln('La hora no es valida; use el formato HHMM.')
    ;   estuvo(Persona, Lugar, Hora)
    ->  formato_hora(Hora, TextoHora),
        format('~w estuvo en ~w a las ~w.~n', [Persona, Lugar, TextoHora])
    ;   formato_hora(Hora, TextoHora),
        format('No hay un movimiento registrado de ~w en ~w a las ~w.~n',
               [Persona, Lugar, TextoHora])
    ).


% Entradas: ninguna (lee Persona, Lugar, Inicio y Fin desde la consola).
% Salidas: ninguna (muestra los movimientos coincidentes).
% Restricciones: Persona y Lugar deben estar registrados; Inicio y Fin deben ser horas validas y formar un intervalo inclusivo.
% Objetivo: consultar los movimientos de una persona dentro de un intervalo mediante estuvo_en_intervalo/4.

opcion_consultar_intervalo :-
    nl,
    writeln('Consultar movimientos por intervalo:'),
    leer_consulta('la persona', Persona),
    leer_consulta('el lugar', Lugar),
    leer_consulta('la hora inicial en formato HHMM', Inicio),
    leer_consulta('la hora final en formato HHMM', Fin),
    (   (   Persona == fin_entrada
        ;   Lugar == fin_entrada
        ;   Inicio == fin_entrada
        ;   Fin == fin_entrada
        )
    ->  writeln('Consulta cancelada por fin de entrada.')
    ;   \+ atom(Persona)
    ->  writeln('La persona debe ser un atomo.')
    ;   \+ persona(Persona)
    ->  writeln('La persona no esta registrada en el caso.')
    ;   \+ atom(Lugar)
    ->  writeln('El lugar debe ser un atomo.')
    ;   \+ lugar(Lugar, _)
    ->  writeln('El lugar no esta registrado en el caso.')
    ;   \+ hora_valida(Inicio)
    ->  writeln('La hora inicial no es valida; use el formato HHMM.')
    ;   \+ hora_valida(Fin)
    ->  writeln('La hora final no es valida; use el formato HHMM.')
    ;   Inicio > Fin
    ->  writeln('La hora inicial no puede ser mayor que la hora final.')
    ;   (   estuvo_en_intervalo(Persona, Lugar, Inicio, Fin)
        ->  findall(Hora,
                    ( estuvo(Persona, Lugar, Hora),
                      Hora >= Inicio,
                      Hora =< Fin ),
                    Movimientos)
        ;   Movimientos = []
        ),
        msort(Movimientos, Ordenados),
        mostrar_movimientos_intervalo(Persona, Lugar, Ordenados)
    ).


% Entradas: Texto de la consulta y una variable para el termino digitado.
% Salidas: Termino leido; fin_entrada si se alcanza el fin de la entrada.
% Restricciones: el termino digitado debe terminar con punto.
% Objetivo: solicitar y leer un dato para una consulta del menu.

leer_consulta(Texto, Termino) :-
    format('Digite ~w seguido de punto: ', [Texto]),
    catch(read(Entrada), _, Entrada = invalida),
    (   Entrada == end_of_file
    ->  Termino = fin_entrada
    ;   Termino = Entrada
    ).


% Entradas: Persona, Lugar y lista de horas registradas.
% Salidas: ninguna (texto en consola).
% Restricciones: las horas se presentan en orden ascendente.
% Objetivo: mostrar los movimientos encontrados para una consulta por intervalo.

mostrar_movimientos_intervalo(_, _, []) :-
    writeln('No hay movimientos registrados para esa persona, lugar e intervalo.').
mostrar_movimientos_intervalo(Persona, Lugar, Horas) :-
    writeln('Movimientos encontrados:'),
    forall(member(Hora, Horas),
           ( formato_hora(Hora, TextoHora),
             format('  ~w estuvo en ~w a las ~w.~n',
                    [Persona, Lugar, TextoHora]) )).


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: si no hay evento o hay mas de uno se indica en el texto.
% Objetivo: mostrar el evento central del caso con su lugar y hora.

mostrar_evento :-
    writeln('Evento central:'),
    (   evento_central(Nombre, Lugar, Hora)
    ->  formato_hora(Hora, Texto),
        format('  ~w en ~w a las ~w~n', [Nombre, Lugar, Texto])
    ;   evento(_, _, _)
    ->  writeln('  El caso tiene mas de un evento; debe existir un unico evento central.')
    ;   writeln('  No hay evento registrado.')
    ).


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: ninguna.
% Objetivo: mostrar las personas definidas mediante persona/1.

mostrar_personas :-
    writeln('Personas relacionadas con el caso:'),
    (   persona(_)
    ->  forall(persona(Persona),
               mostrar_persona(Persona))
    ;   writeln('  No hay personas registradas.')
    ).


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (texto en consola).
% Restricciones: si la persona no tiene accesos registrados se indica en el texto.
% Objetivo: mostrar una persona, sus accesos directos y los accesos que obtiene mediante objetos.

mostrar_persona(Persona) :-
    format('  - ~w~n', [Persona]),
    findall(Lugar, acceso(Persona, Lugar), Lugares),
    (   Lugares == []
    ->  writeln('      acceso directo: ninguno')
    ;   atomic_list_concat(Lugares, ', ', Texto),
        format('      acceso directo: ~w~n', [Texto])
    ),
    forall(( acceso_mediante_objeto(Persona, LugarObjeto, Objeto),
             \+ acceso(Persona, LugarObjeto) ),
           format('      acceso mediante objeto: ~w (con ~w)~n', [LugarObjeto, Objeto])),
    mostrar_movimientos(Persona),
    mostrar_testimonios(Persona),
    mostrar_evidencias_persona(Persona),
    mostrar_coartada_persona(Persona).


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (texto en consola).
% Restricciones: si la persona no tiene movimientos registrados se indica en el texto.
% Objetivo: mostrar los movimientos de una persona segun estuvo/3, ordenados por hora.

mostrar_movimientos(Persona) :-
    findall(Hora-Lugar, estuvo(Persona, Lugar, Hora), Movimientos),
    msort(Movimientos, Ordenados),
    (   Ordenados == []
    ->  writeln('      movimientos: ninguno registrado')
    ;   writeln('      movimientos:'),
        forall(member(Hora-Lugar, Ordenados),
               ( formato_hora(Hora, Texto),
                 format('        ~w  ~w~n', [Texto, Lugar]) ))
    ).


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (texto en consola).
% Restricciones: si la persona no tiene testimonios registrados se indica en el texto.
% Objetivo: mostrar los testimonios de una persona segun testimonio/3, ordenados por hora.

mostrar_testimonios(Persona) :-
    findall(Hora-Lugar, testimonio(Persona, Lugar, Hora), Testimonios),
    msort(Testimonios, Ordenados),
    (   Ordenados == []
    ->  writeln('      testimonios: ninguno registrado')
    ;   writeln('      testimonios:'),
        forall(member(Hora-Lugar, Ordenados),
               ( formato_hora(Hora, Texto),
                 format('        ~w  dice que estuvo en ~w~n', [Texto, Lugar]) ))
    ).


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (texto en consola).
% Restricciones: si no hay evidencias relacionadas se indica en el texto.
% Objetivo: mostrar las evidencias asociadas a una persona segun corresponde/2.

mostrar_evidencias_persona(Persona) :-
    evidencias_de(Persona, Evidencias),
    (   Evidencias == []
    ->  writeln('      evidencias relacionadas: ninguna')
    ;   atomic_list_concat(Evidencias, ', ', Texto),
        format('      evidencias relacionadas: ~w~n', [Texto])
    ).


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (texto en consola).
% Restricciones: se indica que no se pudo establecer una coartada si la informacion disponible no permite inferirla.
% Objetivo: mostrar si los testimonios y movimientos de una persona respaldan una posible coartada para el evento.

mostrar_coartada_persona(Persona) :-
    (   evento_central(_, LugarEvento, HoraEvento),
        tiene_coartada(Persona),
        testimonio(Persona, LugarTestimonio, HoraEvento),
        LugarTestimonio \= LugarEvento
    ->  formato_hora(HoraEvento, TextoHora),
        format('      posible coartada: movimiento y testimonio corroborados en ~w a las ~w~n',
               [LugarTestimonio, TextoHora])
    ;   writeln('      posible coartada: no se pudo establecer con la informacion disponible')
    ).


% Entradas: Hora en formato HHMM.
% Salidas: Texto con la hora en formato HH:MM.
% Restricciones: Hora debe ser un entero.
% Objetivo: presentar una hora HHMM de forma legible.

formato_hora(Hora, Texto) :-
    Horas is Hora // 100,
    Minutos is Hora mod 100,
    format(atom(Texto), '~|~`0t~d~2+:~|~`0t~d~2+', [Horas, Minutos]).


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: ninguna.
% Objetivo: mostrar los lugares definidos mediante lugar/2 con su descripcion.

mostrar_lugares :-
    writeln('Lugares del caso:'),
    (   lugar(_, _)
    ->  forall(lugar(Lugar, Descripcion),
               format('  - ~w: ~s~n', [Lugar, Descripcion]))
    ;   writeln('  No hay lugares registrados.')
    ).


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: ninguna.
% Objetivo: mostrar los objetos definidos mediante objeto/1 junto con su ubicacion.

mostrar_objetos :-
    writeln('Objetos del caso:'),
    (   objeto(_)
    ->  forall(objeto(Objeto),
               mostrar_objeto(Objeto))
    ;   writeln('  No hay objetos registrados.')
    ).


% Entradas: Objeto definido en objeto/1.
% Salidas: ninguna (texto en consola).
% Restricciones: si el objeto no tiene ubicacion registrada se indica en el texto.
% Objetivo: mostrar un objeto y el lugar donde se encontraba segun ubicado/2.

mostrar_objeto(Objeto) :-
    (   ubicado(Objeto, Lugar)
    ->  format('  - ~w (ubicado en ~w)~n', [Objeto, Lugar])
    ;   format('  - ~w (sin ubicacion registrada)~n', [Objeto])
    ).


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: ninguna.
% Objetivo: mostrar las evidencias definidas mediante evidencia/3.

mostrar_evidencias :-
    writeln('Evidencias del caso:'),
    (   evidencia(_, _, _)
    ->  forall(evidencia(Evidencia, Lugar, Hora),
               mostrar_evidencia(Evidencia, Lugar, Hora))
    ;   writeln('  No hay evidencias registradas.')
    ).


% Entradas: Evidencia, Lugar y Hora definidos en evidencia/3.
% Salidas: ninguna (texto en consola).
% Restricciones: si la evidencia no tiene personas relacionadas se indica en el texto.
% Objetivo: mostrar una evidencia y las personas con las que se relaciona segun corresponde/2.

mostrar_evidencia(Evidencia, Lugar, Hora) :-
    formato_hora(Hora, TextoHora),
    findall(Persona, corresponde(Evidencia, Persona), Personas),
    (   Personas == []
    ->  TextoPersonas = 'sin persona relacionada'
    ;   atomic_list_concat(Personas, ', ', Lista),
        atom_concat('corresponde a ', Lista, TextoPersonas)
    ),
    format('  - ~w en ~w a las ~w (~w)~n', [Evidencia, Lugar, TextoHora, TextoPersonas]).


% opcion_investigar, opcion_posibles_responsables, opcion_explicaciones, opcion_resolver_caso
% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: se completan conforme se implementan los predicados de juego en predicados.pl.
% Objetivo: atender cada opcion del menu principal.

opcion_investigar            :- pendiente.
opcion_posibles_responsables :- pendiente.
opcion_explicaciones         :- pendiente.
opcion_resolver_caso         :- pendiente.


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: ninguna.
% Objetivo: indicar que una funcionalidad aun no esta disponible.

pendiente :-
    writeln('Funcionalidad en desarrollo.').
