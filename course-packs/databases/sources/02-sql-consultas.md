# Consultas SQL

Notas de cátedra — Bases de Datos.

## `SELECT` básico

```sql
SELECT atributo1, atributo2
FROM relacion
WHERE predicado;
```

El resultado es otra relación. `WHERE` filtra tuplas; no hay orden garantizado salvo `ORDER BY`.

## Combinar relaciones

- `JOIN` (interno): tuplas que cumplen la condición de igualdad entre claves.
- `LEFT JOIN`: conserva todas las tuplas de la izquierda; atributos de la derecha nulos si no hay match.
- `UNION` / `EXCEPT` / `INTERSECT`: operadores de conjuntos; los esquemas deben ser compatibles.

## Agregación

`GROUP BY` parte la relación en grupos; `COUNT`, `SUM`, `AVG`, `MIN`, `MAX` resumen cada grupo. `HAVING` filtra grupos, no tuplas sueltas.

Estas formas cubren el núcleo de práctica en cátedra antes de subconsultas y DDL.
