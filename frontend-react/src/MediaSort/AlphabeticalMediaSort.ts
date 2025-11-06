import type { media } from "./media.js";
import { MediaSortStrategy } from "./MediaSortStrategy.js";

class AlphabeticalMediaSort extends MediaSortStrategy {
    sort(mediaItems: media[]): void {
        // add alphabetical sorting logic here
    }
}

export { AlphabeticalMediaSort };
