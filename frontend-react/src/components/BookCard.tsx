import type { Book } from "../types.js";

type BookCardProps = {
  book: Book;
  isAdmin: boolean;
  onAddToCart: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
};

const BookCard = ({
  book,
  isAdmin,
  onAddToCart,
  onEdit,
  onDelete,
}: BookCardProps) => {
  const canPurchase = book.active && book.inventoryCount > 0;
  const coverUrl =
    book.coverImageUrl && book.coverImageUrl.length > 0
      ? book.coverImageUrl
      : `https://picsum.photos/seed/book-${book.id ?? book.isbn}/300/450`;

  return (
    <article className={`book-tile ${!book.active ? "book-tile--muted" : ""}`}>
      <div
        className="book-tile__cover"
        style={{ backgroundImage: `url(${coverUrl})` }}
        aria-label={book.title}
      >
        <span className="book-tile__price">${book.price.toFixed(0)}</span>
      </div>
      <div className="book-tile__meta">
        <h3>{book.title}</h3>
        <p>{book.author}</p>
        <p className="price-line">${book.price.toFixed(2)}</p>
        <p className={`stock ${canPurchase ? "in" : "out"}`}>
          {canPurchase ? `${book.inventoryCount} in stock` : "Unavailable"}
        </p>
      </div>
      <div className="book-tile__actions">
        <button onClick={() => onAddToCart(book)} disabled={!canPurchase}>
          Add
        </button>
        {isAdmin && (
          <>
            <button onClick={() => onEdit(book)}>Edit</button>
            <button className="danger" onClick={() => onDelete(book)}>
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export { BookCard };
