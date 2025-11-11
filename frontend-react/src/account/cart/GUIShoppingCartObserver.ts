import type { JSX } from "react";
import type { media } from "../../MediaSort/media.js";
import type { Observer } from "./Observer.js";

class GUIShoppingCartObserver implements Observer {
    private media: media[] = [];

    display(): media[] {
        return this.media;
    }
    update(media: media[]): void {
        this.media = media;
    }
}

export { GUIShoppingCartObserver };