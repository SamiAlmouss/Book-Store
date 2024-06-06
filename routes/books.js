const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {Book, validateCreateBook, validateUpdateBook} = require("../models/Book");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
/**
 * @disc   Get all books  
 * @route  /api/books
 * @method GET
 * @access public
 * 
 */
router.get("/", asyncHandler(
    async (req, res) => {
        const books = await Book.find().sort({title: 1}).select("title author prise").populate("author");
        res.json(books)
        
    }
))

/**
 * @disc   Get Count of Books  
 * @route  /api/books
 * @method GET
 * @access public
 * 
 */
router.get("/count", asyncHandler(
    async (req, res) => {
        const booksCount = await Book.countDocuments();
        res.json({count:booksCount});
        
    }
))

/**
 * @disc   Delete All Books  
 * @route  /api/books
 * @method DELETE
 * @access private (only admin)
 * 
 */
router.delete("/del-all", verifyTokenAndAdmin, asyncHandler(
    async (req, res) => {
      
        const del = await Book.deleteMany();
        if (del) return res.status(200).json({message: "All Books has been deleted"});
        res.json({message: "Command execution failed !"});
    }
))

/**
 * @disc   Get Book by id
 * @route  /api/books
 * @method GET
 * @access public
 * 
 */
router.get("/:id", asyncHandler(
    async (req, res) => {
        const book = await Book.findById(req.params.id).populate("author");
        if(book) return res.status(200).json(book);
        res.status(404).json({message: "Book not found"});
     }
))

/**
 * @disc   Create New Book
 * @route  /api/books
 * @method POST
 * @access private (only admin)
 * 
 */
router.post("/",verifyTokenAndAdmin,asyncHandler(
    async(req,res) =>{
    const {error} = validateCreateBook(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        prise: req.body.prise,
        cover: req.body.cover
    });
    const result = await book.save();
    res.status(201).json(result)
}
)
)

/**
 * @disc   Update a book  
 * @route  /api/books/:id
 * @method PUT
 * @access private (only admin)
 * 
 */
router.put("/:id",verifyTokenAndAdmin,asyncHandler(
    async(req,res) =>{
        const {error} = validateUpdateBook(req.body);
        if(error) return res.status(400).json({message: error.details[0].message});
        const book = await Book.findByIdAndUpdate(req.params.id,{
            $set: {
                title: req.body.title,
                author: req.body.author,
                description: req.body.description,
                prise: req.body.prise,
                cover: req.body.cover
            }
        })
        if(book) return res.status(200).json({message: "Book has been updated"})
        res.status(404).json({message: "Book not found"})
    }
))

/**
 * @disc   Update a book By Id  
 * @route  /api/books/:id
 * @method DELETE
 * @access private (only admin)
 * 
 */
router.delete("/:id",verifyTokenAndAdmin,asyncHandler(
    async(req,res) =>{
        const book = await Book.findByIdAndDelete(req.params.id);
        if(book) return res.status(200).json({message: "Book has been Deleted"});
        res.status(404).json({message: "Book not found"});
    }
))



module.exports = router ;