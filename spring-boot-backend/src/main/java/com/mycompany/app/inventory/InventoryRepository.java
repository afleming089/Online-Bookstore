package com.mycompany.app.inventory;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByBookId(Long bookId);

    boolean existsByBookId(Long bookId);
}
