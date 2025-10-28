package com.mycompany.app.media.book;

import org.springframework.web.bind.annotation.*;

import com.mycompany.app.media.book.BookTypes.PhysicalBook;

import java.util.List;

@RestController
@RequestMapping("/books") // base URL
public class BookController {

    private final BookRepository repo;

    public BookController(BookRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<PhysicalBook> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public PhysicalBook create(@RequestBody PhysicalBook PhysicalBook) {
        return repo.save(PhysicalBook);
    }
}
