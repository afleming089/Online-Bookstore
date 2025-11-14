package com.mycompany.app.order;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.EnumSet;
import java.util.Objects;
import java.util.Set;

import com.mycompany.app.exception.ResourceNotFoundException;
import com.mycompany.app.inventory.InventoryService;
import com.mycompany.app.media.book.BookRepository;
import com.mycompany.app.media.book.BookTypes.PhysicalBook;
import com.mycompany.app.order.dto.CreateOrderRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final InventoryService inventoryService;

    public OrderService(OrderRepository orderRepository,
                        BookRepository bookRepository,
                        InventoryService inventoryService) {
        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.inventoryService = inventoryService;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        if (request == null || request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }
        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);
        Instant now = Instant.now();
        order.setCreatedAt(now);
        order.setUpdatedAt(now);

        for (CreateOrderRequest.LineItem line : request.items()) {
            Long bookId = Objects.requireNonNull(line.bookId(), "bookId is required");
            Integer quantity = Objects.requireNonNull(line.quantity(), "quantity is required");
            if (quantity < 1) {
                throw new IllegalArgumentException("Quantity must be at least 1");
            }
            PhysicalBook book = bookRepository.findById(bookId)
                    .orElseThrow(() -> ResourceNotFoundException.book(bookId));

            OrderItem item = new OrderItem();
            item.setBook(book);
            item.setBookTitle(book.getTitle());
            item.setQuantity(quantity);
            item.setUnitPrice(BigDecimal.valueOf(book.getPrice()));
            order.addItem(item);
        }

        order.recalculateTotal();
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public Order getById(long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.order(id));
    }

    @Transactional
    public Order checkout(CreateOrderRequest request) {
        Order order = createOrder(request);
        inventoryService.decrementOnPayment(order.getItems());
        order.setStatus(OrderStatus.PAID);
        order.setUpdatedAt(Instant.now());
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateStatus(long orderId, OrderStatus newStatus) {
        if (newStatus == null) {
            throw new IllegalArgumentException("status must be provided");
        }
        Order order = getById(orderId);
        OrderStatus current = order.getStatus();
        if (current == newStatus) {
            return order;
        }
        if (!isValidTransition(current, newStatus)) {
            throw new IllegalArgumentException(
                    "Invalid status transition: " + current + " -> " + newStatus);
        }

        boolean becomesPaid = current != OrderStatus.PAID && newStatus == OrderStatus.PAID;
        boolean revertPaid = current == OrderStatus.PAID &&
                (newStatus == OrderStatus.CANCELED || newStatus == OrderStatus.REFUNDED);

        if (becomesPaid) {
            inventoryService.decrementOnPayment(order.getItems());
        } else if (revertPaid) {
            inventoryService.restoreOnCancelOrRefund(order.getItems());
        }

        order.setStatus(newStatus);
        order.setUpdatedAt(Instant.now());
        return orderRepository.save(order);
    }

    private boolean isValidTransition(OrderStatus from, OrderStatus to) {
        if (from == to) {
            return true;
        }
        return switch (from) {
            case PENDING -> Set.of(OrderStatus.PAID, OrderStatus.CANCELED).contains(to);
            case PAID ->
                    EnumSet.of(OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELED, OrderStatus.REFUNDED)
                            .contains(to);
            case SHIPPED -> Set.of(OrderStatus.DELIVERED, OrderStatus.REFUNDED).contains(to);
            case DELIVERED -> to == OrderStatus.REFUNDED;
            case CANCELED, REFUNDED -> false;
        };
    }
}
