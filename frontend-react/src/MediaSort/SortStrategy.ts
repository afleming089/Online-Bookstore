import type { Book } from "../types.js";

interface SortStrategy {
    sort(mediaItems: Book[]): void;
}

export type { SortStrategy };
