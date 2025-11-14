import { useEffect, useMemo, useState } from "react";
import "./BookList.css";
import { BookCard } from "../BookCard";
import { MediaSortContext } from "../../MediaSort/MediaSortContext.js";
import { AlphabeticalMediaSort } from "../../MediaSort/AlphabeticalMediaSort.js";
import { HighestPriceMediaSort } from "../../MediaSort/HighestPriceMediaSort.js";
import { LowestPriceMediaSort } from "../../MediaSort/LowestPriceMediaSort.js";
import type { Book } from "../../types";

type SortOption = "alpha" | "high" | "low";

type BooksListProps = {
  books: Book[];
  isAdmin: boolean;
  onAddToCart: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

const strategyFactory = (option: SortOption) => {
  switch (option) {
    case "high":
      return new HighestPriceMediaSort();
    case "low":
      return new LowestPriceMediaSort();
    case "alpha":
    default:
      return new AlphabeticalMediaSort();
  }
};

const BooksList = ({
  books,
  isAdmin,
  onAddToCart,
  onEdit,
  onDelete,
}: BooksListProps) => {
  const [sortOption, setSortOption] = useState<SortOption>("alpha");
  const [sortedBooks, setSortedBooks] = useState<Book[]>([]);

  const sortContext = useMemo(
    () => new MediaSortContext(new AlphabeticalMediaSort()),
    [],
  );

  useEffect(() => {
    const copy = [...books];
    sortContext.setStrategy(strategyFactory(sortOption));
    sortContext.sortMedia(copy);
    setSortedBooks(copy);
  }, [books, sortContext, sortOption]);

  return (
    <div className="books-list">
      <div className="books-toolbar">
        <span style={{ color: "var(--text-muted)" }}>
          Curated by mood, sortable by preference.
        </span>
        <select
          className="sort-select"
          value={sortOption}
          onChange={(event) => setSortOption(event.target.value as SortOption)}
        >
          <option value="alpha">Alphabetical</option>
          <option value="high">Price (High → Low)</option>
          <option value="low">Price (Low → High)</option>
        </select>
      </div>
      <div className="book-grid">
        {sortedBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            isAdmin={isAdmin}
            onAddToCart={onAddToCart}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export { BooksList };
