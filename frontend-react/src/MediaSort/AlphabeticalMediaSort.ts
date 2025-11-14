import { MediaSortStrategy } from "./MediaSortStrategy.js";
import type { Book } from "../types.js";
import sortArray from "sort-array";

class AlphabeticalMediaSort extends MediaSortStrategy {
  override sort(mediaItems: Book[]): void {
    sortArray(mediaItems, { by: "title" });
  }
}

export { AlphabeticalMediaSort };
