import type { JSX } from "react";
import type { media } from "../../MediaSort/media.js";
import type { Observer } from "./Observer.js";

class GUIShoppingCartObserver implements Observer {
    private mediaHashMap : Map<number, media> = new Map();

    display(): media[] {
        return Array.from(this.mediaHashMap.values());
    }
    update(mediaHashMap : Map<number, media>): void {
        this.mediaHashMap = mediaHashMap;
    }
}

export { GUIShoppingCartObserver };