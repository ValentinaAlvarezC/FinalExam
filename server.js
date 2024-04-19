//CRUD Operations: 
//Student name: Valentina Alvarez C
//Student ID: 300360015
// importing packages
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// require('dotenv').config();

// setups
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//connection with mongoose
mongoose.connect('mongodb+srv://alvarezcorredov:erY8fDvUaDIFuBed@cluster0.tmrvm7o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the express server once connected to MongoDB
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });


 // defining  Schema Class
const Schema = mongoose.Schema;

// Create a Schema object
const bookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },

});

const Book = mongoose.model("bookrecords", bookSchema);

const router = express.Router();

// Mounting the router middleware at a specific path
app.use('/api', router);
 
//Get method to get all books
    router.route("/")
    .get((req, res) => {
        try {
            Book.find()
                .then((books) => {
                    if (books.length == 0) { res.json("No books found") } else { res.json(books) }
                })
        }
        catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

    //Get book by id
    router.route("/:id")
    .get((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => { if (book == null) { res.json("no record found") } else { res.json(book) } })
        }
        catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });


    //Add a new book to the database
    router.route("/add")
    .post((req, res) => {

        try {
            if (req.body.title == null || req.body.author == null || req.body.description == null) {
                res.json("Please submit all the fields for title, author and description.")
            } else {
                const title = req.body.title;
                const author = req.body.author;
                const description = req.body.description;
                // create a new Book object 
                const newBook = new Book({
                    title,
                    author,
                    description
                });

                // save the new object (newBook)
                newBook
                    .save()
                    .then(() => res.json("Book added!"))
                    .catch((err) => res.status(400).json("Error: " + err));
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }
    });

     //Update a book by using the id 
    router.route("/update/:id")
    .put((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => {
                    if (book == null) { res.json("No record found") }
                    else {
                        book.title = req.body.title;
                        book.author = req.body.author;

                        book
                            .save()
                            .then(() => res.json("Book updated!"))
                            .catch((err) => res.status(400).json("Error: " + err));
                    }
                })
                .catch((err) => res.status(400).json("Error: " + err));
        } catch (error) {
        
            res.status(500).json({ message: error.message });
        }
    });

    //Delete a book by using the id 
    router.route("/delete/:id")
    .delete((req, res) => {
        try {
            Book.findById(req.params.id)
                .then((book) => {
                    if (book == null) { res.json("No record found") }
                    else {
                        Book.findByIdAndDelete(req.params.id)
                            .then(() => {
                              
                                res.json("Book deleted!")
                            })
                    }
                })
        }
        catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: error.message });
        }

    });
