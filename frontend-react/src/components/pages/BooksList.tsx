import { MediaSortContext } from "../../MediaSort/MediaSortContext.js";
import { AlphabeticalMediaSort } from "../../MediaSort/AlphabeticalMediaSort.js";
import { HighestPriceMediaSort } from "../../MediaSort/HighestPriceMediaSort.js";
import { LowestPriceMediaSort } from "../../MediaSort/LowestPriceMediaSort.js";

function BooksList(any[]) {
    const mediaSortContext = new MediaSortContext(new AlphabeticalMediaSort());
}


export { BooksList };