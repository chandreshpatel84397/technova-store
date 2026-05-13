# Constants Folder

## Purpose
The `constants` folder stores shared values that should not be duplicated across the application.

## Naming Conventions
- Use descriptive filenames like `routes.ts`, `storage.ts`, and `filters.ts`.
- Export readonly objects with uppercase names for fixed values.
- Export typed arrays when UI choices depend on them.

## Usage Guidelines
- Put route paths, storage keys, nav items, filter options, and app-wide labels here.
- Do not put component state or API responses here.

## Best Practices
- Keep constants framework-agnostic where possible.
- Prefer `as const` for values used as strict TypeScript unions.
- Update constants first when adding a new route or storage key.

## Example Usage
```ts
import { ROUTES } from "@/constants/routes";

router.push(ROUTES.checkout);
```
