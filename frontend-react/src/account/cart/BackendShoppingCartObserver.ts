import type { media } from "../../MediaSort/media.js";
import type { Observer } from "./Observer.js";

class BackendShoppingCartObserver implements Observer {
    update(media: media[]): void {
        throw new Error("Method not implemented.");
    }
}