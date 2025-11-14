import type { CartItem } from "../../types";

interface Observer {
    update(items: Map<number, CartItem>): void;
    display(): CartItem[];
}

export type { Observer };
