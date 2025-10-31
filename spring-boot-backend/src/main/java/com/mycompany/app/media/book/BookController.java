package com.mycompany.app.media.book;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.mycompany.app.media.book.BookTypes.PhysicalBook;

import java.util.List;

@RestController
@RequestMapping("/books") // base URL
public class BookController {

    private final BookService bookService = new BookService();

    @GetMapping
    public List<PhysicalBook> getAllBooks() {
        return new ResponseEntity<>(bookService.getAllBooks(), HttpStatus.OK);
    }

    // admin
    @PostMapping
    public PhysicalBook create(@RequestBody PhysicalBook PhysicalBook) {
        return new ResponseEntity<>(bookService.create(), HttpStatus.OK);
    }
}
