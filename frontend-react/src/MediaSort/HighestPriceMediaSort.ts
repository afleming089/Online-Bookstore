import type { media } from "./media.js";
import { MediaSortStrategy } from "./MediaSortStrategy.js";

import sortArray from 'sort-array';

class HighestPriceMediaSort extends MediaSortStrategy {
    sort(mediaItems: media[]): void {
        sortArray(mediaItems, { by: 'price', order: 'desc'});
    }
}

export { HighestPriceMediaSort };
