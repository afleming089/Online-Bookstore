package com.mycompany.app.media.bookFACTORY;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.databind.JsonNode;
import com.mycompany.app.media.bookFACTORY.BookTypes.PhysicalBook;

@RestController
@RequestMapping("/books") // base URL
@CrossOrigin(origins = "http://localhost:5173")
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
    public ResponseEntity<String> createBook(@RequestBody JsonNode jsonNode) {
        // check for admin auth here
        bookService.createBook(jsonNode);
        return new ResponseEntity<>("POST PhysicalBook ", HttpStatus.OK);
    }
}
