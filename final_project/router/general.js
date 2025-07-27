const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task1 : Get the book list available in the shop
  public_users.get('/', async (req, res) => {
    try {
      const getBooksAsync = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(books);
          }, 100);
        });
      };
  
      const allBooks = await getBooksAsync();
      return res.status(200).json(allBooks);
    } catch (err) {
      return res.status(500).json({ message: "Failed to get books", error: err.message });
    }
  });


// Task 2: Get book details based on ISBN using async/await

public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const getBookByISBN = (isbn) => {
          return new Promise((resolve, reject) => {
            const book = books[isbn];
            if (book) resolve(book);
            else reject("Book not found");
          });
        };
    
        const book = await getBookByISBN(isbn);
        return res.status(200).json(book);
      } catch (err) {
      return res.status(500).json({ message: "Failed to get books", error: err.message });
    }
  });
  


// Task 3: Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;
  
    try {
      const getBooksByAuthor = (author) => {
        return new Promise((resolve, reject) => {
          const allBooks = Object.values(books); // convert to array
          const filteredBooks = allBooks.filter(book => 
            book.author.toLowerCase() === author.toLowerCase()
          );
  
          if (filteredBooks.length > 0) resolve(filteredBooks);
          else reject("No books found by this author");
        });
      };
  
      const booksByAuthor = await getBooksByAuthor(author);
      return res.status(200).json({ books: booksByAuthor });
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  


// Task 4: Get all books based on title using async/await
public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;
  
    try {
      const getBooksByTitle = (title) => {
        return new Promise((resolve, reject) => {
          const allBooks = Object.values(books);
          const filteredBooks = allBooks.filter(book => 
            book.title.toLowerCase() === title.toLowerCase()
          );
  
          if (filteredBooks.length > 0) resolve(filteredBooks);
          else reject("No books found by this title");
        });
      };
  
      const booksByTitle = await getBooksByTitle(title);
      return res.status(200).json({ books: booksByTitle });
      
    } catch (error) {
      return res.status(404).json({ message: error });
    }
  });
  

// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params;
    const book = books[isbn];
    if (!book || !book.reviews) {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
    return res.status(200).json({ reviews: book.reviews });
});

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;