import type { CartSubject } from "./CartSubject.js";
import type { Observer } from "./Observer.js";
import { media } from "../../MediaSort/media.js";

class ShoppingCart implements CartSubject {
    private observers: Observer[] = [];
    private mediaHashmap : Map<media, media> = new Map();

    addObserver(observer: Observer): void {
        this.observers.push(observer);
    }
    removeObserver(observer: Observer): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    notifyObservers(): void {
        console.log(media);
        
        for (const observer of this.observers) {
            observer.update(this.mediaHashmap);
        }
    }

    addMedia(media: media): void {
        this.mediaHashmap.set(media.id, media);
    }
    updateMediaQuantity(id: number, amount: number = 1): void {
        const mediaItem = this.media.find((item) => item.id === id);

        if (!mediaItem) {
            return;
        }
        if (mediaItem.quantity < 1) {
            return;
        }

        mediaItem.incrementQuantity(amount);
    }
    removeMedia(index: number, amount: number = 1): void {
        if (this.media[index]) {
            this.media.splice(index, 1);
            this.notifyObservers();
        }
    }
    getMedia(): media[] {
        return this.media;
    }
}

export { ShoppingCart };