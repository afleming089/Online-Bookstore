import type { media } from "../../MediaSort/media.js";

interface Observer {
    update(media : media[]) : void;
    display() : media[];
}

export type { Observer };