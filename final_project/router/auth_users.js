const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const env = require('dotenv').config()
jwt_key = env.parsed.jwt_key;

let users = [
    { username: "bilawal", password: "1234" }
  ];

const isValid = (username) => {
  return username && typeof username === 'string' && !users.find(user => user.username === username);
};


const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username && user.password === password);
    console.log(users);
    return !!user; // returns true if user exists, false otherwise
  };

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
      }

    if (authenticatedUser(username, password)) {
        let token = jwt.sign({ username }, jwt_key, { expiresIn: "1h" });

        req.session.authorization = { accessToken: token };

        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid credentials" });
    }
});

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;
    const username = req.user.username;
  
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    const book = books[isbn];
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update review
    book.reviews = book.reviews || {};
    book.reviews[username] = review;
  
    return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
  }); 
  
  //Delte book review
  // Delete book review
    regd_users.delete("/auth/review/:isbn", (req, res) => {
        const isbn = req.params.isbn;
        const username = req.user.username;
    
        const book = books[isbn];
        if (!book) {
        return res.status(404).json({ message: "Book not found" });
        }
    
        if (book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
        } else {
        return res.status(404).json({ message: "No review found for this user" });
        }
    });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
