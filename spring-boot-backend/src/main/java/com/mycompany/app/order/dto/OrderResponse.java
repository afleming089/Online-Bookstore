package com.mycompany.app.order.dto;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

import com.mycompany.app.order.OrderStatus;

public record OrderResponse(
        Long id,
        OrderStatus status,
        BigDecimal totalAmount,
        Instant createdAt,
        Instant updatedAt,
        List<OrderItemResponse> items
) {
    public record OrderItemResponse(Long bookId, String title, int quantity, BigDecimal unitPrice) {}
}
