import type { Observer } from "./Observer.js";

interface CartSubject {
    addObserver(observer: Observer): void;
    removeObserver(observer: Observer): void;
    notifyObservers(): void;
}

export type { CartSubject };