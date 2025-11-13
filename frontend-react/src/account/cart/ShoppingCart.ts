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

    setMediaHashMap(mediaHashmap : Map<number, media>){
        this.mediaHashmap = new Map(Array.from(mediaHashmap.values()).map(item => [item.id, new media(item.id, item.title, item.description, item.author, item.price, item.isbn, item.quantity)]));
    }

    addMedia(media: media): void {
      this.mediaHashmap.set(media.id, media);
      this.notifyObservers();
    }

    updateMediaQuantity(id: number, amount: number = 1): void {
        console.log("ran");

        console.log(this.mediaHashmap);

        const mediaItem = this.mediaHashmap.get(id);
        console.log(mediaItem);
        console.log(id);

        if (!mediaItem) {
            return;
        }

        mediaItem.incrementQuantity(amount);

        if (mediaItem.quantity < 1) {
            this.mediaHashmap.delete(id);
            this.removeMedia(id);
            this.notifyObservers();
            return;
        }

        this.mediaHashmap.set(id, mediaItem);
        this.notifyObservers();
    }
   async removeMedia(id: number): Promise<void> {
        this.mediaHashmap.delete(id);
        this.notifyObservers();

            const responsePost = await fetch('http://localhost:8081/auth/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id}),
        });

    }
    getMedia(): media[] {
        return Array.from(this.mediaHashmap.values());
    }
}

export { ShoppingCart };