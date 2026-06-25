# Skill: Commits

## Scope
Usar para preparar commits, decidir si dividir cambios y escribir mensajes.

## Goal
Commits pequenos, explicables y consistentes.

## Rules
- Cada commit debe ser una unica idea explicable en una frase.
- Si no se puede explicar en una frase, dividir.
- Usar formato `type(scope): message`.
- Tipos en minuscula y mensaje imperativo corto.
- Mensajes en ingles.
- Scope: feature o area afectada.
- No usar scopes vagos (misc, general, changes).

## Preferred Types
- `fix`
- `chore`
- `refactor`
- `test`
- `docs`
- `feat`
- `build`

## Preferred Verbs
- `add`
- `create`
- `fix`
- `refactor`
- `update`
- `remove`
- `improve`
- `configure`
- `validate`
- `implement`

## Dependencies
- Revisar el diff final antes de escribir el commit.
- Cargar `05-testing-and-verification` si hay tests involucrados.
- No stage, commit, amend o push sin pedido explicito.

## Output
- agrupacion recomendada
- mensaje recomendado
- rationale de tipo y scope
- warning si hay que dividir
