import { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    fetch("http://localhost:8080/test")
      .then(res => res.text())
      .then(data => console.log("Backend connected:", data))
      .catch(err => console.error("Could not connect to backend:", err))
  }, [])

  const books = [
    {
      id: 1,
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 10.99
    },
    {
      id: 2,
      title: "Harry Potter",
      author: "J.K. Rowling",
      price: 8.49
    },
    {
      id: 3,
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 9.75
    }
  ]

  return (
    <>
      <header>
        <h1>Online Bookstore</h1>
        <nav>
          <a href="#">Home</a>
          <a href="#">Books</a>
          <a href="#">Login</a>
          <a href="#"><i className="fas fa-shopping-cart"></i></a>
        </nav>
      </header>

      <main>
        <h2>Welcome to the Online Bookstore!</h2>
        
        <div className="book-list">
          {books.map(book => (
            <div key={book.id} className="book">
              <h3>{book.title}</h3>
              <p>by {book.author}</p>
              <p><strong>${book.price.toFixed(2)}</strong></p>
              <button>Add to Cart</button>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}

export default App
