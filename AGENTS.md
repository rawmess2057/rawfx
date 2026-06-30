<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Data safety — Prisma migrations

**Never drop columns in a migration that also introduces the replacement schema.**
Always use a two-release process:
1. First release: add the new column/table, write logic to copy data from old to new, deploy and let it run.
2. Second release (after data is verified): drop the old column/table.

Before running any migration in production:
- Always use `prisma migrate dev --create-only` to review the generated SQL before applying
- Check for `DROP COLUMN` or `ALTER TABLE ... DROP` — these destroy data
- If a column must be dropped, first run a data-migration release that preserves existing values

## Zustand persist — versioning

Always add a `version` and `migrate` function to any `persist` config. When the persisted state shape changes, bump the version and handle the migration. This prevents silent data corruption from stale localStorage.
