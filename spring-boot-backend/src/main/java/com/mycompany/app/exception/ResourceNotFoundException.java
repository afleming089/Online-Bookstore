package com.mycompany.app.exception;

/**
 * Thrown when a requested domain object cannot be located.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public static ResourceNotFoundException book(long id) {
        return new ResourceNotFoundException("Book not found: " + id);
    }

    public static ResourceNotFoundException inventoryForBook(long bookId) {
        return new ResourceNotFoundException("Inventory not found for book: " + bookId);
    }

    public static ResourceNotFoundException order(long id) {
        return new ResourceNotFoundException("Order not found: " + id);
    }
}
