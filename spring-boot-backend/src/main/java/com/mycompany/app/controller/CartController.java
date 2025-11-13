package com.mycompany.app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mycompany.app.model.CartItem;
import com.mycompany.app.repository.CartRepository;

@RestController
@RequestMapping("/auth")
public class CartController {

    private CartRepository repo;

    CartController(CartRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/cart")
    public List<CartItem> getCart() {
        return repo.findAll();
    }

    @PostMapping("/cart")
    public String saveCart(@RequestBody List<CartItem> cartItems) {
        System.out.println("Ran Cart");
        repo.saveAll(cartItems);
        return "Cart saved successfully";
    }

    @PutMapping("/cart")
    public String updateCartQuantity(@RequestBody List<CartItem> cartItems) {
        for (CartItem item : cartItems) {
            // Load existing item from DB
            CartItem existing = repo.findById((long) item.getId())
                    .orElseThrow(() -> new RuntimeException("CartItem not found: " + item.getId()));

            // Update only the quantity
            existing.setQuantity(item.getQuantity());

            repo.save(existing);
        }
        return "Cart quantities updated successfully";
    }

    @DeleteMapping("/cart")
    public String delete(@RequestBody Map<String, Object> payload) {
        System.out.println("Ran");

        // Number idObj = (Number) payload.get("id");
        // long bookId = idObj.longValue();
        // repo.deleteById(bookId);

        return "Cart item deleted successfully";
    }
}
