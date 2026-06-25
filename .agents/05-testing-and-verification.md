# Skill: Testing and Verification

## Use When
- Se valida un cambio o se revisa riesgo de regresion.
- Se define checklist manual de QA.

## Goal
Verificar comportamiento con el set minimo y honesto de checks.

## Load Next Only If Needed
- `.agents/references/api-contracts.md`
- `.agents/references/routing-auth-rules.md`
- archivos fuente afectados

## Verification Rules
- Correr `npm run lint` y `npm run build` cuando sea relevante.
- Verificar estados: loading, empty, success y error para UI con data.
- Verificar formularios: validacion, submit, loading, errores.
- Verificar responsive en mobile y desktop.
- Verificar auth/redirects si se toca login o estado de usuario.
- Para cambios backend/Firebase, validar contratos con documentacion.
- Si no hay tests automatizados, entregar checklist manual.

## Output
- checks corridos
- checks manuales requeridos
- estados verificados
- contratos verificados
- gaps conocidos
