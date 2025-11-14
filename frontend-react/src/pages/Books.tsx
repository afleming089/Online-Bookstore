import { useCallback, useEffect, useMemo, useState } from "react";
import { createBook, deleteBook, listBooks, updateBook } from "../api.js";
import { shoppingCart } from "../account/cart/index.js";
import { BooksList } from "../components/pages/BooksList.js";
import { BookModal, type BookModalProps } from "../components/BookModal.js";
import { useAuth } from "../contexts/AuthContext.js";
import type { Book, BookDraft } from "../types.js";

type ModalState =
  | { mode: "add" }
  | { mode: "edit"; book: Book }
  | null;

const BooksPage = () => {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listBooks();
      setBooks(data);
      shoppingCart.syncInventory(data);
    } catch (err) {
      setError("Unable to load books.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const visibleBooks = useMemo(
    () => (isAdmin ? books : books.filter((book) => book.active)),
    [books, isAdmin],
  );

  const handleAddToCart = (book: Book) => {
    shoppingCart.addBook(book);
  };

  const handleSave = async (draft: BookDraft) => {
    try {
      if (modalState?.mode === "edit" && modalState.book) {
        await updateBook(modalState.book.id, draft);
      } else {
        await createBook(draft);
      }
      await loadBooks();
    } catch {
      setError("Unable to save book changes.");
      throw new Error("Unable to save book changes.");
    }
  };

  const handleDelete = async (book: Book) => {
    if (!window.confirm(`Delete ${book.title}?`)) {
      return;
    }
    try {
      await deleteBook(book.id);
      await loadBooks();
    } catch {
      setError("Unable to delete book.");
    }
  };

  return (
    <section className="books-page">
      <div className="books-hero">
        <div>
          <h1>Discover your next favorite story</h1>
        </div>
        <div className="books-hero-actions">
          <div className="user-pill">
            {visibleBooks.length} titles
            <span className="user-role">
              {visibleBooks.filter((book: Book) => book.inventoryCount > 0).length} in stock
            </span>
          </div>
          {isAdmin && (
            <button
              className="primary-button"
              onClick={() => setModalState({ mode: "add" })}
            >
              Add Book
            </button>
          )}
        </div>
      </div>

      {loading && <div className="loading">Loading books…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && (
        <BooksList
          books={visibleBooks}
          isAdmin={isAdmin}
          onAddToCart={handleAddToCart}
          onEdit={(book: Book) => setModalState({ mode: "edit", book })}
          onDelete={handleDelete}
        />
      )}

      {modalState && (
        <BookModal
          mode={modalState.mode}
          initialBook={modalState.mode === "edit" ? modalState.book : undefined as Book | undefined}
          onClose={() => setModalState(null)}
          onSave={handleSave}
        />
      )}
    </section>
  );
};

export default BooksPage;
