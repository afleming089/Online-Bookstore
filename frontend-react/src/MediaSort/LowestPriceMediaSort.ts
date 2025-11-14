import { MediaSortStrategy } from "./MediaSortStrategy.js";
import type { Book } from "../types.js";
import sortArray from "sort-array";

class LowestPriceMediaSort extends MediaSortStrategy {
  override sort(mediaItems: Book[]): void {
    sortArray(mediaItems, { by: "price" });
  }
}

export { LowestPriceMediaSort };
