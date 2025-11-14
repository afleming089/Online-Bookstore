import type { CartItem } from "../../types";
import type { Observer } from "./Observer";

type ChangeListener = (items: CartItem[]) => void;

class GUIShoppingCartObserver implements Observer {
  private items: Map<number, CartItem> = new Map();
  private onChange?: ChangeListener;

  constructor(onChange?: ChangeListener) {
    this.onChange = onChange;
  }

  display(): CartItem[] {
    return Array.from(this.items.values());
  }

  update(items: Map<number, CartItem>): void {
    this.items = items;
    this.onChange?.(this.display());
  }
}

export { GUIShoppingCartObserver };
