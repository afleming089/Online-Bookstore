package com.mycompany.app.media.bookFACTORY;

import com.fasterxml.jackson.databind.JsonNode;
<<<<<<< HEAD
import com.mycompany.app.media.bookFACTORY.BookFactory;
import com.mycompany.app.media.bookFACTORY.BookTypes.PhysicalBook;
=======
import com.mycompany.app.media.MediaFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

import com.mycompany.app.media.book.BookTypes.PhysicalBook;
>>>>>>> 882590bd3a6f920d17df5b748fcbf6d661411e03

/**
 * Service layer for browsing and managing books.
 * Thin orchestrator; leaves persistence to the repository.
 */
@Service
public class BookService {

  private final BookRepository repo;
  private final MediaFactory bookFactory = new BookFactory(); // Factory pattern preserved

  public BookService(BookRepository repo) {
    this.repo = repo;
  }

  /** Fetches all books without applying sorting. */
  @Transactional(readOnly = true)
  public List<PhysicalBook> findAll() {
    return repo.findAll();
  }

  /** Fetches all books and applies optional sort strategy. */
  @Transactional(readOnly = true)
  public List<PhysicalBook> findAllSorted(String sortBy) {
    List<PhysicalBook> list = new ArrayList<>(repo.findAll());

    Comparator<PhysicalBook> cmp = switch (sortBy == null ? "" : sortBy) {
      case "alpha" ->
        Comparator.comparing(b -> Objects.toString(b.getTitle(), "").toLowerCase());
      case "priceAsc" ->
        Comparator.comparingDouble(PhysicalBook::getPrice);
      case "priceDesc" ->
        Comparator.comparingDouble(PhysicalBook::getPrice).reversed();
      case "newest" ->
        Comparator.comparing(
          PhysicalBook::getId,
          java.util.Comparator.nullsLast(Long::compareTo)
        ).reversed();
      default -> (a, b) -> 0;
    };

    list.sort(cmp);
    return list;
  }

  /** Creates a new book instance from request JSON. */
  @Transactional
  public void createBook(JsonNode json) {
    PhysicalBook b = (PhysicalBook) bookFactory.createMedia("PhysicalBook");
    b.setTitle(required(json, "title"));
    b.setAuthor(required(json, "author"));
    b.setDescription(json.path("description").asText(""));
    b.setISBN(required(json, "isbn"));
    b.setPrice(json.path("price").asDouble(0.0));
    // Persist and assert non-null to satisfy null analysis
    Objects.requireNonNull(repo.save(b), "repo.save(...) unexpectedly returned null");
  }

  /** Updates an existing book by id; only provided fields are changed. */
  @Transactional
  public PhysicalBook updateBook(long id, JsonNode json) {
    PhysicalBook b = repo.findById(id)
      .orElseThrow(() -> new IllegalArgumentException("Book not found: " + id));

    if (json.hasNonNull("title"))       b.setTitle(json.get("title").asText());
    if (json.hasNonNull("author"))      b.setAuthor(json.get("author").asText());
    if (json.hasNonNull("description")) b.setDescription(json.get("description").asText());
    if (json.hasNonNull("isbn"))        b.setISBN(json.get("isbn").asText());
    if (json.hasNonNull("price"))       b.setPrice(json.get("price").asDouble());

    return Objects.requireNonNull(repo.save(b), "repo.save(...) unexpectedly returned null");
  }

  /** Deletes a book by id. */
  @Transactional
  public void deleteBook(long id) {
    if (!repo.existsById(id)) {
      throw new IllegalArgumentException("Book not found: " + id);
    }
    repo.deleteById(id);
  }

  // --- helpers ---
  private static String required(JsonNode json, String field) {
    if (!json.hasNonNull(field)) {
      throw new IllegalArgumentException("Missing required field: " + field);
    }
    return json.get(field).asText();
  }
}
