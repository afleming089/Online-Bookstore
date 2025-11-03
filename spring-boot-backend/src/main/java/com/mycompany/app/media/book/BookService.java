package com.mycompany.app.media.book;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.mycompany.app.media.book.BookRepository;
import com.mycompany.app.media.book.BookTypes.PhysicalBook;

@Service
public class BookService {
    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<PhysicalBook> findAll() {
        return repo.findAll();
    }

    // admin
    @PostMapping
    public void create() {

    }

}
