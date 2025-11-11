import type { media } from "./media.js";
import type { MediaSortStrategy } from "./MediaSortStrategy.js";

class MediaSortContext {
    private strategy: MediaSortStrategy;

    constructor(strategy: MediaSortStrategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: MediaSortStrategy): void {
        this.strategy = strategy;
    }

    sortMedia(mediaItems: media[]): void {
        this.strategy.sort(mediaItems);
    }
}

export { MediaSortContext };