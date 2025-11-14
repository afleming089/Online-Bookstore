package com.mycompany.app.order;

import java.util.List;

import com.mycompany.app.order.dto.CreateOrderRequest;
import com.mycompany.app.order.dto.OrderResponse;
import com.mycompany.app.order.dto.UpdateStatusRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<OrderResponse> create(@RequestBody CreateOrderRequest request) {
        Order order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(order));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public OrderResponse getById(@PathVariable long id) {
        return toResponse(orderService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable long id, @RequestBody UpdateStatusRequest request) {
        OrderStatus status = request.status();
        if (status == null) {
            throw new IllegalArgumentException("status must be provided");
        }
        return toResponse(orderService.updateStatus(id, status));
    }

    @PreAuthorize("hasAnyRole('ADMIN','SHOPPER')")
    @PostMapping("/checkout")
    public ResponseEntity<OrderResponse> checkout(@RequestBody CreateOrderRequest request) {
        Order order = orderService.checkout(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(order));
    }

    private static OrderResponse toResponse(Order order) {
        List<OrderResponse.OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderResponse.OrderItemResponse(
                        item.getBook() != null ? item.getBook().getId() : null,
                        item.getBookTitle(),
                        item.getQuantity(),
                        item.getUnitPrice()))
                .toList();
        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                items
        );
    }
}
