package com.mycompany.app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mycompany.app.model.CartItem;

@Repository
public interface CartRepository extends JpaRepository<CartItem, Long> {
}
