import type { SortStrategy } from "./SortStrategy.js";
import type { Book } from "../types.js";

class MediaSortStrategy implements SortStrategy {
    // default no-op; concrete strategies override
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sort(mediaItems: Book[]): void {
    
    }
}

export { MediaSortStrategy };
