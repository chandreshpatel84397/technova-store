# Services Folder

## Purpose
The `services` folder centralizes HTTP and API access logic so components and Redux slices do not call Axios directly.

## Naming Conventions
- Shared Axios configuration lives in `axiosInstance.ts`.
- Domain services use `<domain>Service.ts`, for example `productService.ts`.
- Service methods should be named after the action they perform.

## Usage Guidelines
- Read base URLs from environment variables.
- Add tokens in Axios interceptors.
- Normalize errors before they reach UI components.
- Return typed data from service methods.

## Best Practices
- Keep retry, auth header, and response handling in interceptors.
- Keep mock fallbacks close to the service during frontend-only development.
- Do not store React state in services.

## Example Usage
```ts
const products = await productService.getProducts();
```
