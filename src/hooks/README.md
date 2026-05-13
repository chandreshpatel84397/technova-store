# Hooks Folder

## Purpose
The `hooks` folder stores reusable client-side React hooks for behavior shared across components.

## Naming Conventions
- Hook files start with `use`, for example `useDebounce.ts`.
- Hook functions also start with `use`.
- Keep one main hook per file.

## Usage Guidelines
- Use hooks for reusable browser behavior, derived UI state, or route helpers.
- Keep hooks focused and easy to test.
- Do not call hooks conditionally.

## Best Practices
- Mark hook files with `"use client"` when they use browser APIs or React client hooks.
- Return small, named values rather than large objects with unclear meaning.
- Keep side effects inside `useEffect`.

## Example Usage
```tsx
const debouncedQuery = useDebounce(query, 350);
```
