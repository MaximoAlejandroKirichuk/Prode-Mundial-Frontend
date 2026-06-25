# Skill: React Implementation

## Use When
- Se implementa o cambia comportamiento React.
- Hay componentes, hooks, flows async o formularios.

## Goal
Implementar comportamiento claro, con estados explicitos y minima complejidad accidental.

## Load Next Only If Needed
- `.agents/references/forms-rules.md`
- `.agents/references/state-rules.md`
- `.agents/references/routing-auth-rules.md`
- `.agents/references/api-contracts.md` si hay contrato backend
- archivos fuente afectados

## Implementation Rules
- Preferir composicion sobre pantallas monoliticas.
- Mantener pantallas como orquestacion; UI reusable sin efectos secundarios.
- Usar hooks tipados (`useAppDispatch`, `useAppSelector`) cuando se trabaja con Redux.
- Para formularios simples, usar `src/hooks/useForm.ts` si ya esta en uso.
- Hacer explicitos los estados: loading, submit, empty, error, success.
- Respetar accesibilidad basica: labels, focus, botones semanticos.

## Backend Safety
- Si el comportamiento depende de auth, tokens o payloads, validar con documentacion antes de escribir codigo.

## Output
- comportamiento implementado
- archivos tocados
- estados manejados
- supuestos de contrato
- riesgos o follow-ups
