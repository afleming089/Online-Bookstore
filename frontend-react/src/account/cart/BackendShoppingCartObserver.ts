import type { media } from "../../MediaSort/media.js";
import type { Observer } from "./Observer.js";

class BackendShoppingCartObserver implements Observer {
    private media: media[] = [];
    display(): media[] {
        throw new Error("Method not implemented.");
    }
    async update(media: media[]): Promise<void> {
        this.media = media;

        const repsonse = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.media),
        });

        if (!repsonse.ok) {
            throw new Error('Failed to update backend shopping cart');  
        }
    }
}

export { BackendShoppingCartObserver };