package com.mycompany.app.media.book;

import com.fasterxml.jackson.databind.JsonNode;
import com.mycompany.app.inventory.InventoryService;
import com.mycompany.app.media.MediaFactory;
import com.mycompany.app.media.book.BookTypes.PhysicalBook;
import com.mycompany.app.media.book.dto.BookResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;

/**
 * Service layer for browsing and managing books.
 * Thin orchestrator; leaves persistence to the repository.
 */
@Service
public class BookService {

  private final BookRepository repo;
  private final InventoryService inventoryService;
  private final MediaFactory bookFactory = new BookFactory(); // Factory pattern preserved

  public BookService(BookRepository repo, InventoryService inventoryService) {
    this.repo = repo;
    this.inventoryService = inventoryService;
  }

  /** Fetches all books and applies optional sort strategy before mapping to DTOs. */
  @Transactional(readOnly = true)
  public List<BookResponse> findAllSorted(String sortBy) {
    List<PhysicalBook> list = new ArrayList<>(repo.findAll());

    Comparator<PhysicalBook> cmp = switch (sortBy == null ? "" : sortBy) {
      case "alpha" ->
          Comparator.comparing(b -> Objects.toString(b.getTitle(), "").toLowerCase());
      case "priceAsc" -> Comparator.comparingDouble(PhysicalBook::getPrice);
      case "priceDesc" -> Comparator.comparingDouble(PhysicalBook::getPrice).reversed();
      case "newest" -> Comparator
          .comparing(PhysicalBook::getId, java.util.Comparator.nullsLast(Long::compareTo))
          .reversed();
      default -> (a, b) -> 0;
    };

    list.sort(cmp);
    return list.stream().map(this::toResponse).toList();
  }

  /** Creates a new book instance from request JSON. */
  @Transactional
  public BookResponse createBook(JsonNode json) {
    PhysicalBook b = (PhysicalBook) bookFactory.createMedia("PhysicalBook");
    b.setTitle(required(json, "title"));
    b.setAuthor(required(json, "author"));
    b.setDescription(json.path("description").asText(""));
    b.setISBN(required(json, "isbn"));
    b.setPrice(json.path("price").asDouble(0.0));
    b.setActive(json.path("active").asBoolean(true));
    if (json.hasNonNull("coverImageUrl")) {
      b.setCoverImageUrl(json.get("coverImageUrl").asText());
    }
    PhysicalBook saved =
        Objects.requireNonNull(repo.save(b), "repo.save(...) unexpectedly returned null");
    if (json.has("inventoryCount")) {
      inventoryService.setQuantity(saved.getId(), json.get("inventoryCount").asInt());
    }
    return toResponse(saved);
  }

  /** Updates an existing book by id; only provided fields are changed. */
  @Transactional
  public BookResponse updateBook(long id, JsonNode json) {
    PhysicalBook b =
        repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found: " + id));

    if (json.hasNonNull("title")) {
      b.setTitle(json.get("title").asText());
    }
    if (json.hasNonNull("author")) {
      b.setAuthor(json.get("author").asText());
    }
    if (json.hasNonNull("description")) {
      b.setDescription(json.get("description").asText());
    }
    if (json.hasNonNull("isbn")) {
      b.setISBN(json.get("isbn").asText());
    }
    if (json.hasNonNull("price")) {
      b.setPrice(json.get("price").asDouble());
    }
    if (json.has("active")) {
      b.setActive(json.get("active").asBoolean());
    }
    if (json.has("coverImageUrl")) {
      if (json.get("coverImageUrl").isNull()) {
        b.setCoverImageUrl(null);
      } else {
        b.setCoverImageUrl(json.get("coverImageUrl").asText());
      }
    }

    PhysicalBook saved =
        Objects.requireNonNull(repo.save(b), "repo.save(...) unexpectedly returned null");
    if (json.has("inventoryCount")) {
      inventoryService.setQuantity(saved.getId(), json.get("inventoryCount").asInt());
    }
    return toResponse(saved);
  }

  /** Soft deletes a book by id by toggling the active flag. */
  @Transactional
  public void deleteBook(long id) {
    PhysicalBook book =
        repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found: " + id));
    book.setActive(false);
    repo.save(book);
  }

  private BookResponse toResponse(PhysicalBook book) {
    BookResponse response = new BookResponse();
    response.setId(book.getId());
    response.setTitle(book.getTitle());
    response.setAuthor(book.getAuthor());
    response.setDescription(book.getDescription());
    response.setIsbn(book.getISBN());
    response.setPrice(book.getPrice());
    response.setActive(book.isActive());
    response.setCoverImageUrl(book.getCoverImageUrl());
    Long bookId = book.getId();
    int quantity = bookId == null ? 0 : inventoryService.getQuantitySnapshot(bookId);
    response.setInventoryCount(quantity);
    return response;
  }

  private static String required(JsonNode json, String field) {
    if (!json.hasNonNull(field)) {
      throw new IllegalArgumentException("Missing required field: " + field);
    }
    return json.get(field).asText();
  }
}
