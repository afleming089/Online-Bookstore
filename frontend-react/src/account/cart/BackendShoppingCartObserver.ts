import type { media } from "../../MediaSort/media.js";
import type { Observer } from "./Observer.js";


class BackendShoppingCartObserver implements Observer {
    private mediaHashMap : Map<number, media> = new Map();

    display(): media[] {
        return Array.from(this.mediaHashMap.values());
    }
    async update(mediaHashMap : Map<number, media>): Promise<void> {
        this.mediaHashMap = mediaHashMap;

        console.log(JSON.stringify(Array.from(this.mediaHashMap.values())));

        const responsePost = await fetch('http://localhost:8081/auth/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Array.from(this.mediaHashMap.values())),
        });

        const response = await fetch('http://localhost:8081/auth/cart', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Array.from(this.mediaHashMap.values())),
        });

        if (!response.ok) {
            throw new Error('Failed to update backend shopping cart');
        }
    }
    async remove(id : number){
            const responsePost = await fetch('http://localhost:8081/auth/cart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([{id : id}]),
        });
    }
}

export { BackendShoppingCartObserver };