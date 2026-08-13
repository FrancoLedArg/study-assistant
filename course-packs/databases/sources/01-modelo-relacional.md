# Modelo relacional

Notas de cátedra — Bases de Datos.

## Relación

Una **relación** es un conjunto de tuplas sobre un esquema fijo de atributos. El esquema nombra cada atributo y su dominio. En la práctica, una tabla SQL es la representación usual de una relación: filas = tuplas, columnas = atributos.

No hay orden de filas ni de columnas en el modelo; la identidad de una tupla es su valor, no una posición.

## Claves

- **Superclave**: conjunto de atributos que identifica de forma única cada tupla.
- **Clave candidata**: superclave mínima (ningún subconjunto propio sigue siendo superclave).
- **Clave primaria**: la clave candidata elegida para identificar tuplas en esa relación.
- **Clave foránea**: atributos cuyos valores deben coincidir con la clave primaria (o candidata) de otra relación — o ser nulos, si se permite.

## Integridad

- Integridad de entidad: la clave primaria no admite nulos.
- Integridad referencial: toda clave foránea no nula apunta a una tupla existente.

Estas reglas son el marco desde el que se enseñan restricciones `PRIMARY KEY`, `FOREIGN KEY` y `NOT NULL` en SQL.
