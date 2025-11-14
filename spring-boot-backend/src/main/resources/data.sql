DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM inventory;
DELETE FROM physical_book;

ALTER TABLE physical_book AUTO_INCREMENT = 1;
ALTER TABLE inventory AUTO_INCREMENT = 1;

INSERT INTO physical_book (title, description, author, isbn, price, active, cover_image_url) VALUES
('Clean Code', 'A Handbook of Agile Software Craftsmanship', 'Robert C. Martin', '9780132350884', 42.00, true, 'https://m.media-amazon.com/images/I/71nj3JM-igL._AC_UF1000,1000_QL80_.jpg'),
('The Pragmatic Programmer', 'Your Journey to Mastery, 20th Anniversary Edition', 'Andrew Hunt & David Thomas', '9780135957059', 48.00, true, 'https://m.media-amazon.com/images/I/71f1jieYHNL._AC_UF1000,1000_QL80_.jpg'),
('Designing Data-Intensive Applications', 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems', 'Martin Kleppmann', '9781449373320', 55.00, true, 'https://m.media-amazon.com/images/I/51u9GF2w47L._AC_UF1000,1000_QL80_.jpg'),
('Introduction to Algorithms', 'A broad introduction to modern algorithms', 'Cormen, Leiserson, Rivest, Stein', '9780262046305', 95.00, true, 'https://m.media-amazon.com/images/I/61O5SsbL8HL._AC_UF1000,1000_QL80_.jpg'),
('Refactoring', 'Improving the Design of Existing Code, 2nd Edition', 'Martin Fowler', '9780134757599', 47.50, true, 'https://m.media-amazon.com/images/I/71vEr0oyt-L._AC_UF1000,1000_QL80_.jpg'),
('Accelerate', 'Building and Scaling High Performing Technology Organizations', 'Nicole Forsgren', '9781942788331', 35.00, true, 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781942788331/accelerate-9781942788331_hr.jpg'),
('One Piece Vol. 1', 'The beginning of the Straw Hat Pirates saga', 'Eiichiro Oda', '9781569319017', 9.99, true, 'https://i.ebayimg.com/images/g/-FYAAOSwVydknm--/s-l1200.jpg'),
('Demon Slayer Vol. 5', 'Tanjiro faces ever stronger demons', 'Koyoharu Gotouge', '9781974700554', 10.99, true, 'https://m.media-amazon.com/images/I/81s302EkgiL._AC_UF1000,1000_QL80_.jpg'),
('Chainsaw Man Vol. 3', 'Denji''s chaotic missions escalate', 'Tatsuki Fujimoto', '9781974709953', 11.99, true, 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974709953/chainsaw-man-vol-3-9781974709953_hr.jpg'),
('Slam Dunk Vol. 7', 'Shohoku''s national run continues', 'Takehiko Inoue', '9781569319789', 12.99, true, 'https://m.media-amazon.com/images/I/81-LCJGW7EL._AC_UF1000,1000_QL80_.jpg'),
('The Name of the Wind', 'Day one of Kvothe''s legend', 'Patrick Rothfuss', '9780756404741', 18.00, true, 'https://grimoakpress.com/cdn/shop/files/cover-notw-fc.jpg?v=1706902909'),
('Project Hail Mary', 'A last-chance interstellar mission', 'Andy Weir', '9780593135204', 20.00, true, 'https://m.media-amazon.com/images/I/81zD9kaVW9L._AC_UF1000,1000_QL80_.jpg');

INSERT INTO inventory (book_id, quantity_on_hand, updated_at, version) VALUES
(1, 18, CURRENT_TIMESTAMP, 0),
(2, 24, CURRENT_TIMESTAMP, 0),
(3, 15, CURRENT_TIMESTAMP, 0),
(4, 10, CURRENT_TIMESTAMP, 0),
(5, 22, CURRENT_TIMESTAMP, 0),
(6, 30, CURRENT_TIMESTAMP, 0),
(7, 40, CURRENT_TIMESTAMP, 0),
(8, 34, CURRENT_TIMESTAMP, 0),
(9, 32, CURRENT_TIMESTAMP, 0),
(10, 26, CURRENT_TIMESTAMP, 0),
(11, 28, CURRENT_TIMESTAMP, 0),
(12, 21, CURRENT_TIMESTAMP, 0);
