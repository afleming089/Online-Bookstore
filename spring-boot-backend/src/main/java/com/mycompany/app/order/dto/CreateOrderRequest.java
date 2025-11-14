package com.mycompany.app.order.dto;

import java.util.List;

public record CreateOrderRequest(List<LineItem> items) {

    public record LineItem(Long bookId, Integer quantity) {}
}
