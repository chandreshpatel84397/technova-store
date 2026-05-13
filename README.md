# TechNova

TechNova is a production-style customer e-commerce web application built from scratch with Next.js 14, TypeScript, TailwindCSS v3, Sass Modules, Redux Toolkit, Axios, Framer Motion, and React Icons.

## Setup
```bash
cd e-commerce-site
npm install
npm run dev
```

Create `.env.local` from `.env.example` if you want to change the mock API base URL:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
```

## Required npm Libraries
- Runtime: `next`, `react`, `react-dom`, `@reduxjs/toolkit`, `react-redux`, `axios`, `framer-motion`, `react-icons`, `sass`
- Development: `typescript`, `eslint`, `eslint-config-next`, `tailwindcss`, `postcss`, `autoprefixer`, `@types/node`, `@types/react`, `@types/react-dom`

Next.js App Router is used instead of React Router DOM. The project adapts routing concepts through route constants, protected route wrappers, redirects, dynamic routes, and middleware.

## Architecture
The app uses `src/app` for App Router routes, `src/components` for reusable UI and feature components, `src/redux` for global state, `src/services` for API access, `src/mock` for local product data, `src/constants` for shared app values, `src/hooks` for reusable client behavior, and `src/utils` for pure helpers.

## Folder Flow
- `src/app`: customer pages, auth route group, dynamic product route, loading states, and mock API routes.
- `src/components/ui`: generic primitives like Button, Input, Skeleton, and Spinner.
- `src/components/layout`: Navbar, Footer, providers, app shell, and protected route wrappers.
- `src/components/product`: product cards, grid, quick view modal, image zoom, sale and trending sections.
- `src/components/order`: customer order cards and status UI.
- `src/redux/features`: typed slices for auth, cart, wishlist, products, customer orders, and theme.
- `src/services`: Axios instance and domain service layer.

## Component Communication
Components receive local display data through props, use Redux selectors for shared state, and dispatch typed Redux actions for app-wide changes. UI primitives stay business-logic free; feature components such as `ProductCard` and `CartPage` connect to Redux.

## Redux Flow
The store combines feature slices in `redux/store.ts`. Components use `useAppDispatch` and `useAppSelector`. Product loading demonstrates `createAsyncThunk`, while cart, wishlist, orders, auth, and theme slices persist selected state to LocalStorage.

## Order Flow
The customer adds products to cart, reviews totals, chooses a mock payment method, enters shipping details, and places the order. Checkout dispatches `placeOrder`, saves the order in the `orders` Redux slice, persists all orders in LocalStorage under `technova_orders`, clears the cart, then redirects to `/orders`.

Orders are filtered by the logged-in customer email, so each customer only sees orders created with their own email address.

## Protected Routes
Authentication is mocked with LocalStorage token storage and cookies. LocalStorage powers the client UI state, while cookies allow `middleware.ts` to protect `/wishlist`, `/checkout`, `/orders`, `/cart`, and `/profile`.

## Scalability Notes
New customer features should be added as folders under `components/<domain>`, `redux/features`, and `services`. Keep shared constants in `constants`, reusable browser behavior in `hooks`, and pure formatting or filtering helpers in `utils`. This keeps junior-developer navigation simple while preserving clean ownership boundaries.
