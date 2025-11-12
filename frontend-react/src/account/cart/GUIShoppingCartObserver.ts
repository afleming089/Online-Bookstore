import type { JSX } from "react";
import type { media } from "../../MediaSort/media.js";
import type { Observer } from "./Observer.js";

class GUIShoppingCartObserver implements Observer {
    private mediaMap : Map<number, media> = new Map();

    display(): media[] {
        return Array.from(this.mediaMap.values());
    }
    update(mediaMap : Map<number, media>): void {
        this.mediaMap = mediaMap;
    }
}

export { GUIShoppingCartObserver };