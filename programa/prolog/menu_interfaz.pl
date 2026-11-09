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
%          Las personas se separan por comas; el campo queda vacio si no hay correspondencia.
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
