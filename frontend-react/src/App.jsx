import { useEffect, useState } from "react";
import "./App.css";
import LoginForm from "./LoginForm";
import { BooksList } from "./components/pages/BooksList";
import { Cart } from "./Cart";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99,
      isbn: "9780743273565",
    },
    {
      id: 2,
      title: "Harry Potter",
      author: "J.K. Rowling",
      price: 8.49,
      isbn: "9780743273565",
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 9.75,
      isbn: "9780743273565",
    },
  ]);

  useEffect(() => {
    fetch("http://localhost:8081/test")
      .then((res) => res.text())
      .then((data) => console.log("Backend connected:", data))
      .catch((err) => console.error("Could not connect to backend:", err));

    fetch("http://localhost:8081/books")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched books from backend:", data);
        setBooks(data);
      })
      .catch((err) =>
        console.error("Could not fetch books from backend:", err)
      );
  }, []);

  // Show login form first if not logged in
  if (!isLoggedIn) {
    return (
      <LoginForm setUser={setUser} onLoginSuccess={() => setIsLoggedIn(true)} />
    );
  }

  return (
    <>
      <header>
        <h1>Online Bookstore</h1>
        <nav>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("home");
            }}>
            Home
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("home");
            }}>
            Books
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsLoggedIn(false);
            }}>
            Login
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage("cart");
              setCurrentBook(e.target.book);
            }}>
            <i className="fas fa-shopping-cart"></i>
          </a>
        </nav>
      </header>

      <main>
        {currentPage === "cart" || currentPage.page === "cart" ? (
          <Cart user={user} media={currentPage.prop} />
        ) : (
          <>
            <h2>Welcome to the Online Bookstore!</h2>
            <div className="book-list">
              <BooksList books={books} setCurrentPage={setCurrentPage} />
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default App;
