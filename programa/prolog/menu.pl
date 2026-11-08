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
        mostrar_movimientos_persona_intervalo(Persona, Lugar, Ordenados)
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

mostrar_movimientos_persona_intervalo(_, _, []) :-
    writeln('No hay movimientos registrados para esa persona, lugar e intervalo.').
mostrar_movimientos_persona_intervalo(Persona, Lugar, Horas) :-
    writeln('Movimientos encontrados:'),
    forall(member(Hora, Horas),
           ( formato_hora(Hora, TextoHora),
             format('  ~w estuvo en ~w a las ~w.~n',
                    [Persona, Lugar, TextoHora]) )).


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
    mostrar_movimientos_persona(Persona),
    mostrar_testimonios_persona(Persona),
    mostrar_contradicciones_persona(Persona),
    mostrar_evidencias_persona(Persona),
    mostrar_coartada_persona(Persona),
    mostrar_evaluacion_persona(Persona).


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (texto en consola).
% Restricciones: si la persona no tiene movimientos registrados se indica en el texto.
% Objetivo: mostrar los movimientos de una persona segun estuvo/3, ordenados por hora.

mostrar_movimientos_persona(Persona) :-
    findall(Hora-Lugar, estuvo(Persona, Lugar, Hora), Movimientos),
    msort(Movimientos, Ordenados),
    (   Ordenados == []
    ->  writeln('      movimientos: ninguno registrado')
    ;   writeln('      movimientos:'),
        forall(member(Hora-Lugar, Ordenados),
               ( formato_hora(Hora, Texto),
                 format('        ~w en ~w~n', [Texto, Lugar]) ))
    ).


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (texto en consola).
% Restricciones: si la persona no tiene testimonios registrados se indica en el texto.
% Objetivo: mostrar los testimonios de una persona segun testimonio/3, ordenados por hora.

mostrar_testimonios_persona(Persona) :-
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
% Restricciones: si no hay contradicciones entre testimonios y movimientos se indica en el texto.
% Objetivo: mostrar las diferencias encontradas entre lo declarado y lo registrado para una persona.

mostrar_contradicciones_persona(Persona) :-
    findall(Hora-LugarTestimonio-LugarMovimiento,
            contradiccion_de(Persona, Hora, LugarTestimonio, LugarMovimiento),
            Contradicciones),
    sort(Contradicciones, Ordenadas),
    (   Ordenadas == []
    ->  writeln('      contradicciones: ninguna detectada')
    ;   writeln('      contradicciones entre testimonios y movimientos:'),
        forall(member(Hora-LugarTestimonio-LugarMovimiento, Ordenadas),
               ( formato_hora(Hora, TextoHora),
                 format('        ~w  declara ~w, pero el movimiento registrado indica ~w~n',
                        [TextoHora, LugarTestimonio, LugarMovimiento]) ))
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


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (texto en consola).
% Restricciones: la clasificacion se basa en los predicados posible_sospechoso/1 y descartar/1.
% Objetivo: presentar la evaluacion logica de una persona y los indicios que la sustentan.

mostrar_evaluacion_persona(Persona) :-
    (   posible_sospechoso(Persona)
    ->  evento_central(_, LugarEvento, HoraEvento),
        writeln('      evaluacion: posible sospechoso (segun los indicios disponibles)'),
        mostrar_indicios_sospecha(Persona, LugarEvento, HoraEvento)
    ;   descartar(Persona)
    ->  writeln('      evaluacion: descartado como posible responsable segun las reglas del caso'),
        writeln('        fundamento: coartada corroborada y sin acceso, presencia, evidencia en la escena ni contradiccion a la hora del evento')
    ;   writeln('      evaluacion: informacion insuficiente para sospechar o descartar')
    ).


% Entradas: Persona, Lugar y Hora del evento.
% Salidas: ninguna (texto en consola).
% Restricciones: la Persona debe cumplir posible_sospechoso/1.
% Objetivo: mostrar los accesos e indicios del evento que fundamentan la sospecha.

mostrar_indicios_sospecha(Persona, LugarEvento, HoraEvento) :-
    format('        acceso al lugar del evento: ~w~n', [LugarEvento]),
    findall(HoraEvento,
            estuvo(Persona, LugarEvento, HoraEvento),
            Movimientos),
    sort(Movimientos, MovimientosOrdenados),
    forall(member(HoraMovimiento, MovimientosOrdenados),
           ( formato_hora(HoraMovimiento, TextoMovimiento),
             format('        movimiento en la escena a las ~w~n', [TextoMovimiento]) )),
    findall(HoraEvidencia-Evidencia,
            evidencia_en_evento(Persona, LugarEvento, Evidencia, HoraEvidencia),
            Evidencias),
    sort(Evidencias, EvidenciasOrdenadas),
    forall(member(HoraEvidencia-Evidencia, EvidenciasOrdenadas),
           ( formato_hora(HoraEvidencia, TextoEvidencia),
             format('        evidencia relacionada: ~w, hallada a las ~w~n',
                    [Evidencia, TextoEvidencia]) )),
    findall(LugarTestimonio-LugarMovimiento,
            contradiccion_de(Persona, HoraEvento, LugarTestimonio, LugarMovimiento),
            Contradicciones),
    sort(Contradicciones, ContradiccionesOrdenadas),
    forall(member(LugarTestimonio-LugarMovimiento, ContradiccionesOrdenadas),
           ( formato_hora(HoraEvento, TextoHora),
             format('        contradiccion a las ~w: declara ~w, pero el movimiento indica ~w~n',
                    [TextoHora, LugarTestimonio, LugarMovimiento]) )).


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


% Entradas: ninguna (lee la Persona desde la consola).
% Salidas: ninguna (inicia la investigacion individual o informa su cancelacion).
% Restricciones: la Persona debe indicarse como un atomo registrado; investigar/1 valida el dato.
% Objetivo: solicitar la Persona que se desea investigar y mostrar su informacion.

opcion_investigar :-
    nl,
    writeln('Investigacion individual:'),
    leer_consulta('la persona', Persona),
    (   Persona == fin_entrada
    ->  writeln('Investigacion cancelada por fin de entrada.')
    ;   investigar(Persona)
    ).


% Entradas: Persona indicada para la investigacion.
% Salidas: ninguna (muestra la informacion relevante disponible de la Persona).
% Restricciones: Persona debe ser un atomo definido mediante persona/1.
% Objetivo: reunir y presentar en una consulta los movimientos, accesos, evidencias, coartadas, contradicciones e indicios de la Persona.

investigar(Persona) :-
    atom(Persona),
    persona(Persona), !,
    nl,
    format('Investigacion de ~w:~n', [Persona]),
    mostrar_persona(Persona).
investigar(Persona) :-
    atom(Persona), !,
    format('La persona ~w no esta registrada en el caso.~n', [Persona]).
investigar(_) :-
    writeln('La persona debe indicarse mediante un atomo.').


% Entradas: ninguna.
% Salidas: ninguna (muestra la lista de posibles responsables).
% Restricciones: la lista se obtiene mediante posibles_responsables/1; una lista vacia indica que ningun tripulante cumple las condiciones.
% Objetivo: presentar las personas que cumplen las reglas de sospecha del caso.

opcion_posibles_responsables :-
    posibles_responsables(Lista),
    nl,
    writeln('Posibles responsables segun los indicios del caso:'),
    (   Lista == []
    ->  writeln('  Ningun tripulante cumple las condiciones de sospecha.')
    ;   mostrar_elementos_lista(Lista),
        writeln('La clasificacion indica posibles responsables, no una conclusion de culpabilidad.')
    ).


% Entradas: ninguna (lee la Persona desde la consola).
% Salidas: ninguna (muestra una explicacion del caso para la persona).
% Restricciones: la persona debe estar registrada en persona/1.
% Objetivo: pedir el nombre de la persona y generar una explicacion logica de su papel en el caso.

opcion_explicaciones :-
    nl,
    writeln('Generar explicaciones para una persona:'),
    leer_consulta('la persona', Persona),
    (   Persona == fin_entrada
    ->  writeln('Generacion de explicaciones cancelada por fin de entrada.')
    ;   \+ atom(Persona)
    ->  writeln('La persona debe ser un atomo.')
    ;   \+ persona(Persona)
    ->  writeln('La persona no esta registrada en el caso.')
    ;   findall(Explicacion,
                explicaciones(Persona, Explicacion),
                Explicaciones),
        (   Explicaciones == []
        ->  format('No hay explicaciones disponibles para ~w.~n', [Persona])
        ;   format('~nExplicaciones para ~w:~n', [Persona]),
            forall(member(Explicacion, Explicaciones),
                format('~w~n', [Explicacion]))
        )
    ).



% Entradas: ninguna.
% Salidas: ninguna (resuelve el caso y muestra el resultado).
% Restricciones: la resolucion requiere exactamente un evento central con una hora valida.
% Objetivo: resolver el caso y presentar su resultado.

opcion_resolver_caso :-
    resolver_caso(Resultado),
    mostrar_caso_resuelto(Resultado).


% Entradas: Resultado devuelto por resolver_caso/1.
% Salidas: ninguna (muestra el resultado o el motivo por el que no se pudo resolver).
% Restricciones: Resultado debe ser error_evento, error_hora(Hora) o caso_resuelto/4.
% Objetivo: presentar el resumen de la resolucion del caso.

mostrar_caso_resuelto(error_evento) :-
    nl,
    writeln('No se puede resolver el caso: debe existir exactamente un evento central.').
mostrar_caso_resuelto(error_hora(HoraEvento)) :-
    nl,
    format('No se puede resolver el caso: la hora del evento (~w) no es valida.~n',
           [HoraEvento]).
mostrar_caso_resuelto(caso_resuelto(_, LugarEvento, HoraEvento, Personas)) :-
    nl,
    writeln('=================== Resolucion logica del caso ==================='),
    writeln('             (no es una determinacion de culpabilidad)'),
    mostrar_evento,
    nl,
    mostrar_conclusion_caso(Personas, LugarEvento, HoraEvento).


% Entradas: lista de Personas inferidas como posibles responsables, LugarEvento y HoraEvento.
% Salidas: ninguna (muestra la conclusion y los informes de las personas inferidas).
% Restricciones: Personas puede ser una lista vacia.
% Objetivo: presentar las personas consideradas responsables segun las reglas del caso.

mostrar_conclusion_caso([], _, _) :-
    writeln('No se infirieron posibles responsables.').
mostrar_conclusion_caso(Personas, LugarEvento, HoraEvento) :-
    Personas \= [],
    length(Personas, Cantidad),
    writeln('1. PERSONAS CONSIDERADAS RESPONSABLES:'),
    format('Se infirieron ~w posibles responsables del evento central:~n', Cantidad),
    mostrar_elementos_lista(Personas),
    forall(member(Persona, Personas),
           mostrar_posible_responsable(Persona, LugarEvento, HoraEvento)).


% Entradas: Persona considerada posible responsable, LugarEvento y HoraEvento.
% Salidas: ninguna (muestra el informe individual de la Persona).
% Restricciones: Persona debe pertenecer a la lista inferida por resolver_caso/1.
% Objetivo: presentar evidencias, movimientos, testimonios, accesos, coartadas, contradicciones y justificacion de la Persona.

mostrar_posible_responsable(Persona, LugarEvento, HoraEvento) :-
    nl,
    format('------- Informe de ~w -------~n', [Persona]),
    writeln('2. EVIDENCIAS RELACIONADAS:'),
    mostrar_evidencias_persona_lugar(Persona, LugarEvento),
    writeln('3. UBICACIONES Y MOVIMIENTOS RELEVANTES:'),
    mostrar_movimientos_persona(Persona),
    writeln('   Testimonios registrados:'),
    mostrar_testimonios_persona(Persona),
    writeln('4. ACCESOS RELEVANTES:'),
    mostrar_acceso_persona_lugar(Persona, LugarEvento),
    writeln('5. POSIBLES COARTADAS O CONTRADICCIONES:'),
    mostrar_coartada_persona(Persona),
    mostrar_contradicciones_persona(Persona),
    writeln('6. JUSTIFICACION LOGICA DE LA CONCLUSION:'),
    mostrar_justificacion_responsable(Persona).


% Entradas: Persona y LugarEvento.
% Salidas: ninguna (muestra el tipo de acceso que tiene la Persona al lugar).
% Restricciones: el acceso puede ser directo o inferido mediante un objeto.
% Objetivo: presentar el tipo de acceso que tiene la Persona al lugar del evento, ya sea directo o mediante un objeto.

mostrar_acceso_persona_lugar(Persona, LugarEvento) :-
    (   acceso(Persona, LugarEvento)
    ->  format('     Acceso directo a ~w.~n', [LugarEvento])
    ;   findall(Objeto,
                acceso_mediante_objeto(Persona, LugarEvento, Objeto),
                ObjetosSinOrdenar),
        sort(ObjetosSinOrdenar, Objetos),
        atomic_list_concat(Objetos, ', ', TextoObjetos),
        format('     Acceso inferido a ~w mediante ~w.~n',
               [LugarEvento, TextoObjetos])
    ).


% Entradas: Persona y LugarEvento.
% Salidas: ninguna (muestra las evidencias del evento atribuidas a la Persona).
% Restricciones: si no hay evidencias atribuidas, se indica en el texto.
% Objetivo: listar las evidencias relacionadas con la Persona que fueron halladas en el lugar del evento.

mostrar_evidencias_persona_lugar(Persona, LugarEvento) :-
    findall(Hora-Evidencia,
            evidencia_en_evento(Persona, LugarEvento, Evidencia, Hora),
            EvidenciasSinOrdenar),
    sort(EvidenciasSinOrdenar, Evidencias),
    (   Evidencias == []
    ->  writeln('     Ninguna atribuida a esta persona en la escena.')
    ;   forall(member(Hora-Evidencia, Evidencias),
               ( formato_hora(Hora, TextoHora),
                 format('     - ~w, hallada a las ~w~n', [Evidencia, TextoHora]) ))
    ).


% Entradas: Persona definida en persona/1.
% Salidas: ninguna (muestra las explicaciones disponibles para la Persona).
% Restricciones: si no se puede generar ninguna explicacion, se informa al usuario.
% Objetivo: presentar la justificacion logica de la conclusion para la Persona.

mostrar_justificacion_responsable(Persona) :-
    findall(Explicacion,
            explicaciones(Persona, Explicacion),
            Explicaciones),
    (   Explicaciones == []
    ->  writeln('No se pudo generar una justificacion de la conclusion.')
    ;   forall(member(Explicacion, Explicaciones),
           format('~w~n', [Explicacion]))
    ).
