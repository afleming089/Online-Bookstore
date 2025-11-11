package com.mycompany.app.media.book;

import com.fasterxml.jackson.databind.JsonNode;
import com.mycompany.app.media.book.BookTypes.PhysicalBook;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for public browse and admin management of books.
 * Delegates all business logic to BookService.
 */
@RestController
@RequestMapping("/books")
public class BookController {

  private final BookService bookService;

  public BookController(BookService bookService) {
    this.bookService = bookService;
  }

  // PUBLIC: GET /books?sortBy=alpha|priceAsc|priceDesc|newest
  @GetMapping
  public ResponseEntity<List<PhysicalBook>> getAllBooks(@RequestParam(value = "sortBy", required = false) String sortBy) {
    return ResponseEntity.ok(bookService.findAllSorted(sortBy));
  }

  // ADMIN: create
  @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<String> createBook(@RequestBody JsonNode jsonNode) {
    bookService.createBook(jsonNode);
    return ResponseEntity.ok("Created PhysicalBook");
  }

  // ADMIN: update
  @PreAuthorize("hasRole('ADMIN')")
  @PutMapping("/{id}")
  public ResponseEntity<PhysicalBook> updateBook(@PathVariable long id, @RequestBody JsonNode jsonNode) {
    return ResponseEntity.ok(bookService.updateBook(id, jsonNode));
  }

  // ADMIN: delete
  @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<Void> deleteBook(@PathVariable long id) {
    bookService.deleteBook(id);
    return new ResponseEntity<>(HttpStatus.NO_CONTENT);
  }
}
