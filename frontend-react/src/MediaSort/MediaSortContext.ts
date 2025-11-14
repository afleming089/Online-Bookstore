import type { MediaSortStrategy } from "./MediaSortStrategy.js";
import type { Book } from "../types.js";

class MediaSortContext {
    private strategy: MediaSortStrategy;

    constructor(strategy: MediaSortStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: MediaSortStrategy): void {
        this.strategy = strategy;
    }

    sortMedia(books: Book[]): void {
        this.strategy.sort(books);
    }
}

export { MediaSortContext };
