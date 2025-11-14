package com.mycompany.app.inventory;

import java.util.List;
import java.util.Objects;
import java.util.function.Supplier;

import com.mycompany.app.exception.InsufficientStockException;
import com.mycompany.app.exception.ResourceNotFoundException;
import com.mycompany.app.media.book.BookRepository;
import com.mycompany.app.media.book.BookTypes.PhysicalBook;
import com.mycompany.app.order.OrderItem;
import jakarta.persistence.OptimisticLockException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final BookRepository bookRepository;

    public InventoryService(InventoryRepository inventoryRepository, BookRepository bookRepository) {
        this.inventoryRepository = inventoryRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional(readOnly = true)
    public List<Inventory> findAll() {
        return inventoryRepository.findAll();
    }

    @Transactional
    public Inventory getOrCreateForBook(long bookId) {
        return inventoryRepository.findByBookId(bookId)
                .orElseGet(() -> {
                    PhysicalBook book = bookRepository.findById(bookId)
                            .orElseThrow(() -> ResourceNotFoundException.book(bookId));
                    Inventory inventory = new Inventory();
                    inventory.setBook(book);
                    inventory.setQuantityOnHand(0);
                    try {
                        return inventoryRepository.save(inventory);
                    } catch (DataIntegrityViolationException ex) {
                        // Another transaction inserted concurrently; load the existing one.
                        return inventoryRepository.findByBookId(bookId)
                                .orElseThrow(() -> ResourceNotFoundException.inventoryForBook(bookId));
                    }
                });
    }

    @Transactional(readOnly = true)
    public Inventory getByBookId(long bookId) {
        return inventoryRepository.findByBookId(bookId)
                .orElseThrow(() -> ResourceNotFoundException.inventoryForBook(bookId));
    }

    @Transactional(readOnly = true)
    public int getQuantitySnapshot(long bookId) {
        return inventoryRepository.findByBookId(bookId)
                .map(Inventory::getQuantityOnHand)
                .orElse(0);
    }

    @Transactional
    public Inventory setQuantity(long bookId, int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Quantity must be non-negative");
        }
        return withOptimisticLockRetry(() -> {
            Inventory inventory = getOrCreateForBook(bookId);
            inventory.setQuantityOnHand(quantity);
            return inventoryRepository.save(inventory);
        });
    }

    @Transactional
    public Inventory adjust(long bookId, int delta) {
        return withOptimisticLockRetry(() -> {
            Inventory inventory = getOrCreateForBook(bookId);
            int newQty = inventory.getQuantityOnHand() + delta;
            if (newQty < 0) {
                throw new IllegalArgumentException("Quantity cannot drop below zero");
            }
            inventory.setQuantityOnHand(newQty);
            return inventoryRepository.save(inventory);
        });
    }

    @Transactional
    public void decrementOnPayment(List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            return;
        }
        withOptimisticLockRetry(() -> {
            for (OrderItem item : items) {
                PhysicalBook book = Objects.requireNonNull(item.getBook(), "Order item missing book reference");
                long bookId = book.getId();
                Inventory inventory = inventoryRepository.findByBookId(bookId)
                        .orElseThrow(() -> new InsufficientStockException(bookId, item.getQuantity(), 0));
                int available = inventory.getQuantityOnHand();
                int requested = item.getQuantity();
                if (available < requested) {
                    throw new InsufficientStockException(bookId, requested, available);
                }
                inventory.setQuantityOnHand(available - requested);
                inventoryRepository.save(inventory);
            }
            return null;
        });
    }

    @Transactional
    public void restoreOnCancelOrRefund(List<OrderItem> items) {
        if (items == null || items.isEmpty()) {
            return;
        }
        withOptimisticLockRetry(() -> {
            for (OrderItem item : items) {
                PhysicalBook book = Objects.requireNonNull(item.getBook(), "Order item missing book reference");
                Inventory inventory = getOrCreateForBook(book.getId());
                inventory.setQuantityOnHand(inventory.getQuantityOnHand() + item.getQuantity());
                inventoryRepository.save(inventory);
            }
            return null;
        });
    }

    private <T> T withOptimisticLockRetry(Supplier<T> action) {
        try {
            return action.get();
        } catch (ObjectOptimisticLockingFailureException | OptimisticLockException ex) {
            return action.get();
        }
    }
}
