import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Book, BookDraft } from "../types.js";

export type BookModalProps = {
  mode: "add" | "edit";
  initialBook?: Book | null;
  onClose: () => void;
  onSave: (payload: BookDraft) => Promise<void>;
};

const emptyDraft: BookDraft = {
  title: "",
  author: "",
  description: "",
  isbn: "",
  price: 0,
  inventoryCount: 0,
  active: true,
  coverImageUrl: "",
};

const BookModal = ({ mode, initialBook, onClose, onSave }: BookModalProps) => {
  const [form, setForm] = useState<BookDraft>(emptyDraft);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialBook) {
      const { id: _id, ...rest } = initialBook;
      setForm(rest);
    } else {
      setForm(emptyDraft);
    }
  }, [initialBook]);

  const handleChange = (
    field: keyof BookDraft,
    value: string | number | boolean,
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.title || !form.author || !form.isbn) {
      setError("Title, author, and ISBN are required.");
      return;
    }
    if (form.price < 0 || form.inventoryCount < 0) {
      setError("Price and inventory must be non-negative.");
      return;
    }
    setError(null);
    setIsSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save book.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <header>
          <h2>{mode === "add" ? "Add Book" : "Edit Book"}</h2>
          <button className="close" aria-label="Close dialog" onClick={onClose}>
            ×
          </button>
        </header>
        <form onSubmit={handleSubmit} className="modal-body">
          <label>
            Title
            <input
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
            />
          </label>
          <label>
            Author
            <input
              value={form.author}
              onChange={(e) => handleChange("author", e.target.value)}
              required
            />
          </label>
          <label>
            Description
            <textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </label>
          <label>
            ISBN
            <input
              value={form.isbn}
              onChange={(e) => handleChange("isbn", e.target.value)}
              required
            />
          </label>
          <label>
            Price
            <input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
              required
            />
          </label>
          <label>
            Inventory Count
            <input
              type="number"
              min="0"
              value={form.inventoryCount}
              onChange={(e) =>
                handleChange("inventoryCount", Number(e.target.value))
              }
              required
            />
          </label>
          <label>
            Cover image URL
            <input
              placeholder="https://example.com/cover.jpg"
              value={form.coverImageUrl ?? ""}
              onChange={(e) => handleChange("coverImageUrl", e.target.value)}
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => handleChange("active", e.target.checked)}
            />
            Active
          </label>
          {error && <p className="modal-error">{error}</p>}
          <footer>
            <button type="button" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export { BookModal };
