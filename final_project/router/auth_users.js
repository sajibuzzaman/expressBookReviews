const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
try {
  if (username.length > 0) {
    return true;
  }
  return false;
} catch (error) {
  return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
try {
  if (users.length > 0) {
    for (let user in users) {
      if (users[user].username === username) {
        if (users[user].password === password) {
          return true;
        }
        else {
          return false;
        }
      }
    }
  }
  return false;
} catch (error) {
  return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  try {
    const username = req.body.username;
    const password = req.body.password;
    if (isValid(username)) {
      if (users.length > 0) {
        for (let user in users) {
          if (users[user].username === username) {
            if (users[user].password === password) {
              const token = jwt.sign({id: users[user].username}, 'fingerprint_customer', {
                expiresIn: 86400 // expires in 24 hours
              });

              // store the token in the session object for the user to use later on in the application
              req.session.authorization = token;
              return res.status(200).json({message: "User logged in successfully"});
            }
            else {
              return res.status(400).json({message: "Incorrect password"});
            }
          }
        }
      }
      return res.status(400).json({message: "Username does not exist"});
    }
    else {
      return res.status(400).json({message: "Username is not valid"});
    }
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({message: "Error in logging in the user", error: error});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    const review = req.query.review;
    if(review !== undefined){
    if (review.length > 0) {
      for (let book in books) {
        if (books[book].isbn === isbn) {
          //reviews is object with username and review as keys
          if (books[book].reviews === undefined) {
            books[book].reviews = {};
          }

          //if the user has already reviewed the book
          for (let review1 in books[book].reviews) {
            if (books[book].reviews[review1].username === req.user.id) {
              books[book].reviews[review1].review = review;
              return res.status(200).json({message: "Review updated successfully", review: books[book].reviews});
            }
          }

          
          //here we are adding a new object into a object
          books[book].reviews = {...books[book].reviews, [books[book].reviews.length + 1]: {username: req.user.id, review: review}};
          return res.status(200).json({message: "Review added successfully", review: books[book].reviews});
        }
      }
      return res.status(400).json({message: "ISBN does not exist"});
    }
    else {
      return res.status(400).json({message: "Review is not valid"});
    }
  }
  
    return res.status(400).json({message: "Review is not valid"});
    
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({message: "Error in adding the review", error: error});
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  try {
    const isbn = req.params.isbn;
    for (let book in books) {
      if (books[book].isbn === isbn) {
        if (books[book].reviews !== undefined) {
          for (let review in books[book].reviews) {
            if (books[book].reviews[review].username === req.user.id) {
              delete books[book].reviews[review];
              return res.status(200).json({message: "Review deleted successfully"});
            }
          }
        }
        return res.status(400).json({message: "No reviews to delete"});
      }
    }
    return res.status(400).json({message: "ISBN does not exist"});
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({message: "Error in deleting the review", error: error});
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;