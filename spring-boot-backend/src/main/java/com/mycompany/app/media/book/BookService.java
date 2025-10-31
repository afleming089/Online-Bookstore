package com.mycompany.app.media.book;

import org.springframework.stereotype.Service;

import com.mycompany.app.media.book.BookRepository;
import com.mycompany.app.media.book.BookTypes.Book;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public void create() {
    }

    public Book getAllBooks() {
        return null;
    }
}
