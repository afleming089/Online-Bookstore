import "./BookList.css";

import { MediaSortContext } from "../../MediaSort/MediaSortContext.js";
import { AlphabeticalMediaSort } from "../../MediaSort/AlphabeticalMediaSort.js";
import { HighestPriceMediaSort } from "../../MediaSort/HighestPriceMediaSort.js";
import { LowestPriceMediaSort } from "../../MediaSort/LowestPriceMediaSort.js";
import { useState, useEffect, type Key } from "react";

type BooksListProps = {
  books: any[];
  setCurrentPage: any; // you can make this more specific later
};

function BooksList({ books, setCurrentPage }: BooksListProps) {
    const mediaSortContext = new MediaSortContext(new AlphabeticalMediaSort());
    const [sortedBooks, setSortedBooks] = useState<any[]>([...books]);

    useEffect(() => {
        mediaSortContext.sortMedia(books);
        setSortedBooks([...books]);
    }, []);

    const handleClick = (book: any) => {
        setCurrentPage({page : "cart", prop : book});
    }

    return <>
        <div className="grid">
            <div>
                <select onChange={(e) => {
                        const value = e.target.value;
                        if (value === "alphabetical") {
                            mediaSortContext.setStrategy(new AlphabeticalMediaSort());
                        } else if (value === "highestPrice") {
                            mediaSortContext.setStrategy(new HighestPriceMediaSort());
                        } else if (value === "lowestPrice") {
                            mediaSortContext.setStrategy(new LowestPriceMediaSort());
                        }
                        mediaSortContext.sortMedia(books);
                        setSortedBooks([...books]);
                    }}>

                    <option value="alphabetical">Alphabetical</option>
                    <option value="highestPrice">Highest Price</option>
                    <option value="lowestPrice">Lowest Price</option>
                </select>
            </div>
            <div className="grid">
                {sortedBooks.map((book: { id: Key; title: string, author: string, price: number, isbn : string; }) => (
                <div key={book.id} className="book">
                    <h3>{book.title}</h3>
                    <p>by {book.author}</p>
                    <p>
                        <strong>${book.price.toFixed(2)}</strong>
                    </p>
                    <p>ISBN : {book.isbn}</p>
                    <button onClick={() => handleClick(book)}>Add to Cart</button>
                </div>
                ))}
            </div>
        </div>
    </>
}


export { BooksList };

