const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // The code should take the ‘username’ and ‘password’ provided in the body of the request for registration. 
  // If the username already exists, 
  // it must mention the same & must also show other errors like eg. when username &/ password are not provided.
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (isValid(username)) {
      if (users.length > 0) {
        for (let user in users) {
          if (users[user].username === username) {
            return res.status(400).json({message: "Username already exists"});
          }
        }
      }
      users.push({username: username, password: password});
      return res.status(200).json({message: "User registered successfully"});
    }
    else {
      return res.status(400).json({message: "Username is not valid"});
    }
  } catch (error) {
    return res.status(500).json({message: "Error in registering the user", error: error});
  }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  //Write your code here
  //using Promise callbacks or async-await with Axios
  try {
    const bookList = JSON.stringify(books);
    return res.status(200).json({message: bookList});
  } catch (error) {
    return res.status(500).json({message: "Error in getting the book list", error: error});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    let bookList = [];
    for (let book in books) {
      if (books[book].isbn === isbn) {
        bookList.push(books[book]);
      }
    }
    if (bookList.length > 0) {
      return res.status(200).json({message: bookList});
    }
    else {
      return res.status(404).json({message: "Book not found"});
    }
  }
  catch (error) {
    return res.status(500).json({message: "Error in getting the book details", error });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    let bookList = [];
    for (let book in books) {
      if (books[book].author === author) {
        bookList.push(books[book]);
      }
    }
    if (bookList.length > 0) {
      return res.status(200).json({message: bookList});
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  }
  catch (error) {
    return res.status(500).json({message: "Error in getting the book details", error });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    let bookList = [];
    for (let book in books) {
      if (books[book].title === title) {
        bookList.push(books[book]);
      }
    }
    if (bookList.length > 0) {
      return res.status(200).json({message: bookList});
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  }
  catch (error) {
    return res.status(500).json({message: "Error in getting the book details", error });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    let bookList = [];
    for (let book in books) {
      if (books[book].isbn === isbn) {
        bookList.push(books[book]);
      }
    }
    if (bookList.length > 0) {
      return res.status(200).json({message: bookList[0].review});
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  }
  catch (error) {
    return res.status(500).json({message: "Error in getting the book details", error });
  }
});

module.exports.general = public_users;