import type { JSX } from "react";
import type { media } from "../../MediaSort/media.js";
import type { Observer } from "./Observer.js";

class BackendShoppingCartObserver implements Observer {
    private media: media[] = [];
    display(): media[] {
        throw new Error("Method not implemented.");
    }
    update(media: media[]): void {
        this.media = media;
    }
}

export { BackendShoppingCartObserver };