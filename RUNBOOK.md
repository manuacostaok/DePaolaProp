# Runbook — Backups y restore de la base (Fase 6.4)

*El proyecto corre sobre Neon (Postgres serverless). Dev y producción usan la MISMA base de datos — no hay ambiente de staging separado (ver `AGENTS.md`/`de-paola-fase22-...md`, sección 6 "Qué NO tocar"). Esto hace que un restore no sea un ejercicio teórico: si algo sale mal en local (una migración mal aplicada, un `db push` destructivo, un seed corrido contra la base equivocada), es la base real la que hay que restaurar.*

## Pendiente de confirmar (no verificable desde acá)

Este documento **no tiene acceso al dashboard de Neon** — solo a la cadena de conexión (`DATABASE_URL`). Antes de confiar en este runbook en un incidente real, alguien con acceso a la cuenta de Neon debe confirmar:

1. **Qué plan tiene el proyecto** (Free, Launch, Scale, etc.) — determina la ventana de retención de point-in-time recovery (PITR). En el plan Free de Neon la ventana histórica es corta (horas); planes pagos extienden esto a días.
2. **La ventana de retención actual configurada** en Project Settings → Backup & Restore.
3. Si hace falta más retención que la del plan actual, evaluar upgrade — es una decisión de costo recurrente, no algo que se resuelva en código.

## Cómo restaurar (Point-in-Time Recovery vía Neon)

Neon no usa `pg_dump`/`pg_restore` tradicional como mecanismo principal — su primitiva es crear una **rama (branch)** de la base a partir de un timestamp o LSN anterior, dentro de la ventana de retención del plan.

1. Entrar a [console.neon.tech](https://console.neon.tech) → el proyecto de De Paola.
2. Ir a **Branches** → **Restore** (o crear una branch nueva con "Time Travel" apuntando al momento anterior al incidente).
3. Elegir el punto en el tiempo (timestamp legible, no hace falta el LSN exacto salvo que se necesite precisión de segundos).
4. Neon crea una branch nueva con el estado de la base en ese momento — **no sobreescribe la base actual automáticamente**, así que hay una decisión intermedia:
   - **Verificar primero:** conectar temporalmente `DATABASE_URL` (local, nunca en Vercel todavía) a la branch restaurada y confirmar que los datos son los esperados antes de promoverla.
   - **Promover:** una vez confirmado, en Neon existe la opción de "reset" la branch principal (`main`) al estado de la branch restaurada, o cambiar cuál branch es la que sirve la `DATABASE_URL` de producción (Project Settings → Connection Details).
5. Actualizar `DATABASE_URL` en Vercel (Project Settings → Environment Variables) si el restore implicó apuntar a una branch distinta, y re-deployar.

## Backup manual adicional (defensivo, no depende del plan de Neon)

Como capa extra independiente de la retención de Neon, correr un dump lógico antes de cualquier cambio de schema riesgoso (ya es la práctica que se viene siguiendo en este proyecto — ver `prisma migrate diff` antes de cada `db push`, documentado en los commits de las Fases 1-5):

```bash
pg_dump "$DATABASE_URL" --format=custom --file="backup-$(date +%Y%m%d-%H%M%S).dump"
```

Restore de ese dump (a la MISMA base o a una branch de prueba primero):

```bash
pg_restore --clean --if-exists --dbname="$DATABASE_URL" backup-YYYYMMDD-HHMMSS.dump
```

**Nunca correr el restore de arriba directo contra `DATABASE_URL` de producción sin antes probarlo contra una branch de Neon separada** — dado que dev y prod comparten la misma base, no hay una segunda oportunidad si el dump está desactualizado o el restore trae datos viejos encima de leads/propiedades reales cargadas después del backup.

## Antes de cualquier cambio de schema (ya establecido, documentado acá para que quede en un solo lugar)

```bash
npx prisma migrate diff --from-config-datasource --to-schema prisma/schema.prisma --script
```

Revisar el SQL generado — si es puramente aditivo (`CREATE TABLE`/`CREATE TYPE`/columnas nuevas nullable), es seguro. Si incluye `DROP`/`ALTER COLUMN` con pérdida de datos, parar y confirmar con el usuario antes de `prisma db push`.
