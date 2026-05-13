export const ROUTES = {
  home: "/",
  shop: "/products",
  categories: "/categories",
  about: "/about",
  contact: "/contact",
  login: "/login",
  signup: "/signup",
  profile: "/profile",
  wishlist: "/wishlist",
  cart: "/cart",
  checkout: "/checkout",
  orders: "/orders"
} as const;

export interface NavItem {
  label: string;
  href: string;
}

export const publicNavItems: NavItem[] = [
  { label: "Home", href: ROUTES.home },
  { label: "Shop", href: ROUTES.shop },
  { label: "Categories", href: ROUTES.categories },
  { label: "About", href: ROUTES.about },
  { label: "Contact", href: ROUTES.contact }
];
