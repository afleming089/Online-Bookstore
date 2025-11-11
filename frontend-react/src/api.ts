import axios from "axios";

// Domain shape must mirror backend entity
export interface PhysicalBook {
  id?: number;
  title: string;
  author: string;
  description?: string;
  isbn: string;
  price: number;
}

export const listBooks = (sortBy?: string) =>
  axios.get<PhysicalBook[]>("/api/books", { params: { sortBy } });

export const createBook = (payload: PhysicalBook) =>
  axios.post("/api/books", payload, {
    auth: { username: "admin", password: "admin123" },
  });

export const updateBook = (id: number, payload: Partial<PhysicalBook>) =>
  axios.put(`/api/books/${id}`, payload, {
    auth: { username: "admin", password: "admin123" },
  });

export const deleteBook = (id: number) =>
  axios.delete(`/api/books/${id}`, {
    auth: { username: "admin", password: "admin123" },
  });
