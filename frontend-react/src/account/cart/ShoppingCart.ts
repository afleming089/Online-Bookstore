import type { Book, CartItem } from "../../types";
import type { CartSubject } from "./CartSubject";
import type { Observer } from "./Observer";

class ShoppingCart implements CartSubject {
  private observers: Observer[] = [];
  private items: Map<number, CartItem> = new Map();

  addObserver(observer: Observer): void {
    this.observers.push(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notifyObservers(): void {
    for (const observer of this.observers) {
      observer.update(new Map(this.items));
    }
  }

  addBook(book: Book): void {
    if (book.inventoryCount <= 0) {
      return;
    }
    const existing = this.items.get(book.id);
    const nextQuantity = Math.min(
      (existing?.quantity ?? 0) + 1,
      book.inventoryCount,
    );
    const nextItem: CartItem = {
      bookId: book.id,
      title: book.title,
      price: book.price,
      quantity: nextQuantity,
      inventoryCount: book.inventoryCount,
    };
    this.items.set(book.id, nextItem);
    this.notifyObservers();
  }

  setQuantity(bookId: number, quantity: number): void {
    const item = this.items.get(bookId);
    if (!item) {
      return;
    }
    if (quantity <= 0) {
      this.items.delete(bookId);
      this.notifyObservers();
      return;
    }
    const clamped = Math.min(quantity, item.inventoryCount);
    this.items.set(bookId, { ...item, quantity: clamped });
    this.notifyObservers();
  }

  adjustQuantity(bookId: number, delta: number): void {
    const item = this.items.get(bookId);
    if (!item) {
      return;
    }
    this.setQuantity(bookId, item.quantity + delta);
  }

  remove(bookId: number): void {
    this.items.delete(bookId);
    this.notifyObservers();
  }

  clear(): void {
    this.items.clear();
    this.notifyObservers();
  }

  list(): CartItem[] {
    return Array.from(this.items.values());
  }

  hydrate(items: CartItem[]): void {
    this.items = new Map(items.map((item) => [item.bookId, item]));
    this.notifyObservers();
  }

  syncInventory(books: Book[]): void {
    const inventory = new Map(books.map((book) => [book.id, book.inventoryCount]));
    let changed = false;
    for (const [bookId, item] of this.items) {
      const nextInventory = inventory.get(bookId);
      if (typeof nextInventory === "number") {
        if (nextInventory <= 0) {
          this.items.delete(bookId);
          changed = true;
          continue;
        }
        const clampedQuantity = Math.min(item.quantity, nextInventory);
        if (
          clampedQuantity !== item.quantity ||
          nextInventory !== item.inventoryCount
        ) {
          this.items.set(bookId, {
            ...item,
            quantity: clampedQuantity,
            inventoryCount: nextInventory,
          });
          changed = true;
        }
      }
    }
    if (changed) {
      this.notifyObservers();
    }
  }
}

export { ShoppingCart };
