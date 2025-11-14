import { BackendShoppingCartObserver, CART_STORAGE_KEY } from "./BackendShoppingCartObserver";
import { GUIShoppingCartObserver } from "./GUIShoppingCartObserver";
import { ShoppingCart } from "./ShoppingCart";
import type { CartItem } from "../../types";

const shoppingCart = new ShoppingCart();

if (typeof window !== "undefined") {
  const cached = window.localStorage.getItem(CART_STORAGE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as CartItem[];
      shoppingCart.hydrate(parsed);
    } catch {
      // ignore malformed cache
    }
  }
}

const backendObserver = new BackendShoppingCartObserver();
shoppingCart.addObserver(backendObserver);

export { shoppingCart, GUIShoppingCartObserver };
