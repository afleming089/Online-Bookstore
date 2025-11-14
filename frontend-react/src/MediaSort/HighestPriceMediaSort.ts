import { MediaSortStrategy } from "./MediaSortStrategy.js";
import type { Book } from "../types.js";
import sortArray from "sort-array";

class HighestPriceMediaSort extends MediaSortStrategy {
  override sort(mediaItems: Book[]): void {
    sortArray(mediaItems, { by: "price", order: "desc" });
  }
}

export { HighestPriceMediaSort };
