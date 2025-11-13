package com.mycompany.app.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
        System.out.println(repo.findAll());
        return repo.findAll();
    }

    @PostMapping("/cart")
    public String saveCart(@RequestBody List<CartItem> cartItems) {
        System.out.println("Ran Cart");
        repo.saveAll(cartItems);
        return "Cart saved successfully";
    }

}
