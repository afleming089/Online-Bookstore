import type { media } from "../../MediaSort/media.js";

interface Observer {
    update(mediaMap : Map<number, media>) : void;
    display() : media[];
}

export type { Observer };