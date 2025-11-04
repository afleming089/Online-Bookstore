package com.mycompany.app.media.book;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.mycompany.app.media.book.BookTypes.PhysicalBook;

@Repository
public interface BookRepository extends CrudRepository<PhysicalBook, Long> {
}