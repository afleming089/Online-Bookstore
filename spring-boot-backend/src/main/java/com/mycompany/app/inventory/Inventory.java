package com.mycompany.app.inventory;

import java.time.Instant;

import com.mycompany.app.media.book.BookTypes.PhysicalBook;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "book_id", nullable = false, unique = true)
    private PhysicalBook book;

    @Column(name = "book_id", insertable = false, updatable = false)
    private Long bookId;

    @Column(nullable = false)
    private int quantityOnHand;

    @Version
    private Long version;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    @PreUpdate
    void touchUpdatedAt() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public PhysicalBook getBook() {
        return book;
    }

    public void setBook(PhysicalBook book) {
        this.book = book;
    }

    public Long getBookId() {
        return bookId != null ? bookId : (book != null ? book.getId() : null);
    }

    public int getQuantityOnHand() {
        return quantityOnHand;
    }

    public void setQuantityOnHand(int quantityOnHand) {
        this.quantityOnHand = quantityOnHand;
    }

    public Long getVersion() {
        return version;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}
