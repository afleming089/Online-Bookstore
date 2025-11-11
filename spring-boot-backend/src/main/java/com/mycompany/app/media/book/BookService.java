package com.mycompany.app.media.bookFACTORY;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import com.fasterxml.jackson.databind.JsonNode;
import com.mycompany.app.media.bookFACTORY.BookFactory;
import com.mycompany.app.media.bookFACTORY.BookTypes.PhysicalBook;

@Service
public class BookService {
    private final BookRepository repo;
    private final BookFactory bookFactory = new BookFactory();

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public Iterable<PhysicalBook> findAll() {
        try {
            return repo.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching books: " + e.getMessage());
        }
    }

    // admin
    @PostMapping
    public void createBook(JsonNode jsonNode) {
        try {
            PhysicalBook physicalBook = (PhysicalBook) bookFactory.createMedia("PhysicalBook");

            physicalBook.setTitle(jsonNode.findValue("title").asText());
            physicalBook.setAuthor(jsonNode.findValue("author").asText());
            physicalBook.setDescription(jsonNode.findValue("description").asText());
            physicalBook.setISBN(jsonNode.findValue("isbn").asText());
            physicalBook.setPrice(jsonNode.findValue("price").asDouble());

            repo.save(physicalBook);
        } catch (Exception e) {
            throw new RuntimeException("Error creating PhysicalBook: " + e.getMessage());
        }
    }
}
