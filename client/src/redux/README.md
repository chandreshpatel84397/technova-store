# Redux Folder

## Purpose
The `redux` folder contains global application state for authentication, products, cart, wishlist, customer orders, and theme preferences.

## Naming Conventions
- Store setup lives in `store.ts`.
- Typed hooks live in `hooks.ts`.
- Feature logic lives in `features/<featureName>Slice.ts`.
- Slice files export actions, selectors, and the reducer.

## Usage Guidelines
- Use `useAppDispatch()` instead of `useDispatch()`.
- Use `useAppSelector()` instead of `useSelector()`.
- Keep slice state small and serializable.
- Use async thunks for API or service calls.

## Best Practices
- Keep server data fetching inside services and thunks.
- Keep UI-only local state inside components.
- Export selectors so components do not need to know state shape details.
- Persist customer-owned browser data such as cart, wishlist, theme, and orders through focused slices.

## Example Usage
```tsx
const dispatch = useAppDispatch();
const items = useAppSelector(selectCartItems);
dispatch(addToCart(product));
```
