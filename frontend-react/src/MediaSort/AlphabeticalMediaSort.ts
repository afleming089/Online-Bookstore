import type { media } from "./media.js";
import { MediaSortStrategy } from "./MediaSortStrategy.js";

import sortArray from 'sort-array';

class AlphabeticalMediaSort extends MediaSortStrategy {
    sort(mediaItems: media[]): void {
        sortArray(mediaItems, { by: 'title' });
    }
}

export { AlphabeticalMediaSort };
