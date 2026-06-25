# Skill: Requirements

## Use When
- El pedido es vago o incompleto.
- Se define una feature, pantalla o flujo nuevo.
- Los criterios de aceptacion o el alcance no estan claros.

## Goal
Convertir un pedido suelto en comportamiento concreto, alcance explicito y criterios de aceptacion implementables sin inventar reglas backend.

## Load Next Only If Needed
- `.agents/references/api-contracts.md` si hay dependencia backend/Firebase
- `.agents/references/repo-map.md` para ubicacion
- archivos fuente afectados

## Working Rules
- Separar intencion de producto de supuestos tecnicos.
- Listar estados requeridos: loading, empty, error, success y edge cases de auth/permisos.
- No inventar colecciones, reglas o claims de Firebase.
- Pedir aclaracion cuando el repo no resuelva una decision critica de negocio.
- Si docs y codigo difieren, reportar el drift.

## Output
- objetivo
- alcance
- restricciones
- estados de UI requeridos
- dependencias backend/Firebase
- criterios de aceptacion
- supuestos y preguntas abiertas
