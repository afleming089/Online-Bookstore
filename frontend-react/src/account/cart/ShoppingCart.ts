import type { CartSubject } from "./CartSubject.js";
import type { Observer } from "./Observer.js";

class ShoppingCart implements CartSubject {
    addObserver(observer: Observer): void {
        throw new Error("Method not implemented.");
    }
    removeObserver(observer: Observer): void {
        throw new Error("Method not implemented.");
    }
    notifyObservers(): void {
        throw new Error("Method not implemented.");
    }
}

export { ShoppingCart };