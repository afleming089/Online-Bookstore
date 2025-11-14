package com.mycompany.app.exception;

/**
 * Raised when an order attempts to consume more inventory than is available.
 */
public class InsufficientStockException extends RuntimeException {

    private final long bookId;
    private final int requestedQuantity;
    private final int availableQuantity;

    public InsufficientStockException(long bookId, int requestedQuantity, int availableQuantity) {
        super(buildMessage(bookId, requestedQuantity, availableQuantity));
        this.bookId = bookId;
        this.requestedQuantity = requestedQuantity;
        this.availableQuantity = availableQuantity;
    }

    private static String buildMessage(long bookId, int requested, int available) {
        return "Insufficient inventory for book %d: requested=%d available=%d"
                .formatted(bookId, requested, available);
    }

    public long getBookId() {
        return bookId;
    }

    public int getRequestedQuantity() {
        return requestedQuantity;
    }

    public int getAvailableQuantity() {
        return availableQuantity;
    }
}
