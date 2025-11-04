package com.mycompany.app.media.book;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.mycompany.app.media.book.BookTypes.PhysicalBook;

import java.util.List;

@RestController
@RequestMapping("/books") // base URL
public class BookController {

    private final BookService bookService;

    BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<Iterable<PhysicalBook>> getAllBooks() {
        return new ResponseEntity<>(bookService.findAll(), HttpStatus.OK);
    }

    // admin
    @PostMapping
    public ResponseEntity<String> save(@RequestBody PhysicalBook PhysicalBook) {
        bookService.save(PhysicalBook);
        return new ResponseEntity<>("POST PhysicalBook ", HttpStatus.OK);
    }
}
