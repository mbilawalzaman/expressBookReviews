const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

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

// Task 10: Get the book list using async/await
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return res.status(200).json({ books: response.data });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details based on ISBN using async/await
public_users.get('/isbn/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/books/${isbn}`);
        return res.status(200).json({ book: response.data });
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Task 12: Get book details based on author using async/await
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const response = await axios.get('http://localhost:5000/books');
        const filteredBooks = Object.values(response.data).filter(book => book.author === author);
        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found by this author" });
        }
        return res.status(200).json({ books: filteredBooks });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 13: Get all books based on title using async/await
public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const response = await axios.get('http://localhost:5000/books');
        const filteredBooks = Object.values(response.data).filter(book => book.title === title);
        if (filteredBooks.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }
        return res.status(200).json({ books: filteredBooks });
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
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

module.exports.general = public_users;