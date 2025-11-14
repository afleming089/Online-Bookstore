export type Role = "ADMIN" | "SHOPPER";

export interface Book {
  id: number;
  title: string;
  author: string;
  description: string;
  isbn: string;
  price: number;
  inventoryCount: number;
  active: boolean;
  coverImageUrl?: string | null;
}

export type BookDraft = Omit<Book, "id">;

export interface CartItem {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
  inventoryCount: number;
}

export interface CheckoutRequest {
  items: Array<{
    bookId: number;
    quantity: number;
  }>;
}

export interface OrderSummary {
  id: number;
  status: string;
  totalAmount: number;
}

export type PaymentMethod = "credit" | "paypal";
