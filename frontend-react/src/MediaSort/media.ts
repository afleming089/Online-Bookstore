export class media {
    id: number;
    title: string;
    description: string;
    author: string;
    price: number;
    isbn: string;
    quantity: number;

    constructor(
        id: number,
        title: string,
        description: string,
        author: string,
        price: number,
        isbn: string,
        quantity: number
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.price = price;
        this.isbn = isbn;
        this.quantity = quantity;
    }

    incrementQuantity(amount : number): void {
        this.quantity += amount;
    }

    decrementQuantity(amount : number): void {
        this.quantity = Math.max(0, this.quantity -= amount);
    }
}
