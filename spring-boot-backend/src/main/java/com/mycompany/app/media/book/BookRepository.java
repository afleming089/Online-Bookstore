package com.mycompany.app.media.bookFACTORY;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mycompany.app.media.bookFACTORY.BookTypes.PhysicalBook;

@Repository
public interface BookRepository extends JpaRepository<PhysicalBook, Long> { }
