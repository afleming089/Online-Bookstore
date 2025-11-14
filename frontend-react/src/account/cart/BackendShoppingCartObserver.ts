import type { CartItem } from "../../types";
import type { Observer } from "./Observer";

const STORAGE_KEY = "online-bookstore-cart";

class BackendShoppingCartObserver implements Observer {
  private items: Map<number, CartItem> = new Map();

  display(): CartItem[] {
    return Array.from(this.items.values());
  }

  update(items: Map<number, CartItem>): void {
    this.items = items;
    const payload = JSON.stringify(Array.from(items.values()));
    localStorage.setItem(STORAGE_KEY, payload);
  }
}

export { BackendShoppingCartObserver, STORAGE_KEY as CART_STORAGE_KEY };
