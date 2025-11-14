package com.mycompany.app.inventory.dto;

import java.time.Instant;

public record InventoryResponse(Long id, Long bookId, int quantityOnHand, Instant updatedAt) {}
