# API contract & type reference

## `api.yaml`

The authoritative OpenAPI 3.1 spec for the Calls4u cabinet backend. Treat it as
the source of truth for request/response shapes and error codes.

## Hand-written types vs generated reference

The app's domain types live in `src/app/(app)/_lib/types/*` and
`src/lib/types/*`. They are hand-written on purpose: they use clean domain
names (`Agent`, `Contact`, …), mark fields non-optional where the API always
returns them, and model request-param shapes that the spec describes only
loosely. These are the types application code imports.

`api-types.generated.ts` is a **reference artifact**, not application code. It
is produced from `api.yaml` by `openapi-typescript` and is excluded from the
TypeScript build, ESLint, and Prettier. Nothing imports it.

## When the API changes

1. Update `api.yaml` from the backend.
2. Regenerate the reference: `pnpm types:api`.
3. Diff `api-types.generated.ts` to see what moved, then update the hand-written
   types in `src/.../types/*` to match. The generated file is the checklist; the
   hand-written types stay the ergonomic, non-optional source the app consumes.
