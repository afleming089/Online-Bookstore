package com.mycompany.app.order;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.lang.NonNull;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Override
    @EntityGraph(attributePaths = {"items", "items.book"})
    @NonNull
    java.util.Optional<Order> findById(@NonNull Long id);
}
