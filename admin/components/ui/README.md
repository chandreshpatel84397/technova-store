# UI Components Folder

## Purpose
The `components/ui` folder contains small reusable interface primitives such as buttons, inputs, skeletons, and loading spinners.

## Naming Conventions
- Components use PascalCase filenames: `Button.tsx`.
- Component-specific Sass Modules use the same name: `Button.module.scss`.
- Props interfaces should be named after the component, for example `ButtonProps`.

## Usage Guidelines
- Keep UI primitives generic and reusable.
- Accept `className` for layout-specific customization.
- Avoid placing product, cart, or auth business logic inside UI primitives.

## Best Practices
- Use Tailwind for layout and quick utility styling.
- Use Sass Modules for component-specific states and variants.
- Keep accessibility labels on icon-only buttons.

## Example Usage
```tsx
<Button icon={FiShoppingCart} onClick={handleAddToCart}>
  Add to cart
</Button>
```
