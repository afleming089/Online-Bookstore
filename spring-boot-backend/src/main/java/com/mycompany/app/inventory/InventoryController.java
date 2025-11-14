package com.mycompany.app.inventory;

import java.util.List;

import com.mycompany.app.inventory.dto.AdjustQuantityRequest;
import com.mycompany.app.inventory.dto.InventoryResponse;
import com.mycompany.app.inventory.dto.SetQuantityRequest;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/inventory")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "http://localhost:5173")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    public List<InventoryResponse> listAll() {
        return inventoryService.findAll().stream()
                .map(InventoryController::toResponse)
                .toList();
    }

    @GetMapping("/{bookId}")
    public InventoryResponse getByBook(@PathVariable long bookId) {
        return toResponse(inventoryService.getByBookId(bookId));
    }

    @PutMapping("/{bookId}/set")
    public InventoryResponse setQuantity(@PathVariable long bookId, @RequestBody SetQuantityRequest request) {
        int qty = requireNonNull(request.quantityOnHand(), "quantityOnHand must be provided");
        return toResponse(inventoryService.setQuantity(bookId, qty));
    }

    @PostMapping("/{bookId}/adjust")
    public InventoryResponse adjust(@PathVariable long bookId, @RequestBody AdjustQuantityRequest request) {
        int delta = requireNonNull(request.delta(), "delta must be provided");
        return toResponse(inventoryService.adjust(bookId, delta));
    }

    private static InventoryResponse toResponse(Inventory inventory) {
        return new InventoryResponse(
                inventory.getId(),
                inventory.getBookId(),
                inventory.getQuantityOnHand(),
                inventory.getUpdatedAt()
        );
    }

    private static int requireNonNull(Integer value, String message) {
        if (value == null) {
            throw new IllegalArgumentException(message);
        }
        return value;
    }
}
