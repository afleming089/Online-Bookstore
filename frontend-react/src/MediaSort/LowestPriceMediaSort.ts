import type { media } from "./media.js";
import { MediaSortStrategy } from "./MediaSortStrategy.js";

import sortArray from 'sort-array';

class LowestPriceMediaSort extends MediaSortStrategy {
    sort(mediaItems: media[]): void {
        sortArray(mediaItems, { by: 'price' , order: 'desc' });
    }
}

export { LowestPriceMediaSort };
