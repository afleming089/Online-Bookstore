import type { media } from "./media.js";

interface SortStrategy {
    sort(mediaItems: media[]): void;
}

export type { SortStrategy };