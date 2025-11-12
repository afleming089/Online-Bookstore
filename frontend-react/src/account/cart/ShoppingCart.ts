import type { CartSubject } from "./CartSubject.js";
import type { Observer } from "./Observer.js";
import { media } from "../../MediaSort/media.js";

class ShoppingCart implements CartSubject {
    private observers: Observer[] = [];
    private mediaHashmap : Map<number, media> = new Map();

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    removeObserver(observer: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers(): void {
        for (const observer of this.observers) {
            observer.update(this.mediaHashmap);
        }
    }

    addMedia(media: media): void {
      this.mediaHashmap.set(media.id, media);
      this.notifyObservers();
    }
    updateMediaQuantity(id: number, amount: number = 1): void {
        const mediaItem = this.mediaHashmap.get(id);
 
        if (!mediaItem) {
            return;
        }

        mediaItem.incrementQuantity(amount);

        if (mediaItem.quantity < 1) {
            this.mediaHashmap.delete(id);
            this.notifyObservers();
            return;
        }

        this.mediaHashmap.set(id, mediaItem);
        this.notifyObservers();
    }
    removeMedia(id: number): void {
        this.mediaHashmap.delete(id);
        this.notifyObservers();
    }
    getMedia(): media[] {
        return Array.from(this.mediaHashmap.values());
    }
}

export { ShoppingCart };