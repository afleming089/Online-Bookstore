import axios from "axios";
import type {
  Book,
  BookDraft,
  CheckoutRequest,
  OrderSummary,
} from "./types.js";

const client = axios.create({
  baseURL: "http://localhost:8081",
});

type AuthProvider = () => string | undefined;

let authHeaderProvider: AuthProvider | undefined;

client.interceptors.request.use((config) => {
  if (authHeaderProvider) {
    const headerValue = authHeaderProvider();
    if (headerValue) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = headerValue;
    }
  }
  return config;
});

export const setAuthHeaderProvider = (provider?: AuthProvider) => {
  authHeaderProvider = provider;
};

export const listBooks = async (): Promise<Book[]> => {
  const response = await client.get<Book[]>("/books");
  return response.data;
};

export const createBook = async (payload: BookDraft): Promise<Book> => {
  const response = await client.post<Book>("/books", payload);
  return response.data;
};

export const updateBook = async (
  id: number,
  payload: Partial<BookDraft>,
): Promise<Book> => {
  const response = await client.put<Book>(`/books/${id}`, payload);
  return response.data;
};

export const deleteBook = async (id: number): Promise<void> => {
  await client.delete(`/books/${id}`);
};

export const checkout = async (
  request: CheckoutRequest,
): Promise<OrderSummary> => {
  const response = await client.post<OrderSummary>("/orders/checkout", request);
  return response.data;
};
