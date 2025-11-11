import type { CartSubject } from "./CartSubject.js";
import type { Observer } from "./Observer.js";
import { media } from "../../MediaSort/media.js";

class ShoppingCart implements CartSubject {
    private observers: Observer[] = [];
    private media : media[] = [];

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    removeObserver(observer: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this.media);
        }
    }

    addMedia(media: media): void {
        media.incrementQuantity(1);
        this.media.push(media);

        this.notifyObservers();
    }
    // addMedia(id: number, amount: number): void {
    //     this.media[id].incrementQuantity(amount);
    //     this.notifyObservers();
    // }
    removeMedia(index: number, amount: number = 1): void {
        if (this.media[index]) {
            this.media[index].decrementQuantity(amount);
            this.media.splice(index, 1);
            this.notifyObservers();
        }
    }
    getMedia(): media[] {
        return this.media;
    }
}

export { ShoppingCart };