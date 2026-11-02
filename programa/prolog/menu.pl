% Entradas: ninguna.
% Salidas: Numero de la opcion, Texto a mostrar y Accion a ejecutar.
% Restricciones: Numero debe ser un entero unico; Accion debe ser un predicado de aridad 0. La opcion 0 se reserva para salir.
% Objetivo: definir las opciones disponibles en el menu principal.

opcion_menu(1, 'Consultar informacion del caso', opcion_consultar_caso).
opcion_menu(2, 'Investigar a una persona',       opcion_investigar).
opcion_menu(3, 'Obtener posibles responsables',  opcion_posibles_responsables).
opcion_menu(4, 'Generar explicaciones',          opcion_explicaciones).
opcion_menu(5, 'Resolver el caso',               opcion_resolver_caso).


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
    mostrar_personas,
    nl,
    mostrar_lugares,
    nl,
    mostrar_objetos.


% Entradas: ninguna.
% Salidas: ninguna (texto en consola).
% Restricciones: ninguna.
% Objetivo: mostrar las personas definidas mediante persona/1.

mostrar_personas :-
    writeln('Personas relacionadas con el caso:'),
    (   persona(_)
    ->  forall(persona(Persona),
               format('  - ~w~n', [Persona]))
    ;   writeln('  No hay personas registradas.')
    ).


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
% Objetivo: mostrar los objetos definidos mediante objeto/1.

mostrar_objetos :-
    writeln('Objetos del caso:'),
    (   objeto(_)
    ->  forall(objeto(Objeto),
               format('  - ~w~n', [Objeto]))
    ;   writeln('  No hay objetos registrados.')
    ).


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
