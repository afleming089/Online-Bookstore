package com.mycompany.app.order.dto;

import com.mycompany.app.order.OrderStatus;

public record UpdateStatusRequest(OrderStatus status) {}
