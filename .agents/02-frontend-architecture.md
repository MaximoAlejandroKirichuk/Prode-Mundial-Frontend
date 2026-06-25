# Skill: Frontend Architecture

## Use When
- Se decide donde ubicar codigo.
- Se define estructura de componentes, hooks, slices o integraciones.
- Se pregunta como estructurar un cambio frontend en este repo.

## Goal
Elegir la estructura mas simple que respete las convenciones actuales de Uai-Extension.

## Load Next Only If Needed
- `.agents/references/repo-map.md`
- `.agents/references/state-rules.md`
- `.agents/references/forms-rules.md`
- `.agents/references/routing-auth-rules.md`
- archivos fuente afectados

## Placement Rules
- Pantallas y flows principales: `src/presentation/screens/`.
- Componentes UI compartidos: `src/presentation/components/`.
- Entidades y modelos: `src/core/entities/`.
- Estado global: `src/store/` y `src/store/slices/`.
- Hooks reutilizables: `src/hooks/`.
- Integraciones Firebase: `src/firebase/`.

## React Structure Rules
- Preferir estado local y derivado.
- Usar Redux solo cuando el estado es compartido o session-critical.
- Evitar efectos secundarios dentro de componentes UI genericos.
- Extraer hooks o subcomponentes antes de que un archivo sea dificil de leer.

## Backend Safety
- Si el comportamiento depende del backend/Firebase, validar reglas antes de decidir la estructura.

## Output
- ubicacion elegida
- alternativas descartadas si aplica
- limites de ownership
- referencias cargadas
- supuestos
