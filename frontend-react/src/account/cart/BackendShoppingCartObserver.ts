import type { media } from "../../MediaSort/media.js";
import type { Observer } from "./Observer.js";

class BackendShoppingCartObserver implements Observer {
    private mediaMap : Map<number, media> = new Map();

    display(): media[] {
        throw new Error("Method not implemented.");
    }
    async update(mediaMap : Map<number, media>): Promise<void> {
        this.mediaMap = mediaMap;

        // const repsonse = await fetch('/api/cart', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(this.media),
        // });

        // if (!repsonse.ok) {
        //     throw new Error('Failed to update backend shopping cart');  
        // }
    }
}

export { BackendShoppingCartObserver };