const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");
const {Author, validateAuthor, validateUpdateAuthor} = require("../models/Author");



/**
 * @disc   Get all authors
 * @route  /api/authors
 * @method GET
 * @access public
 *  
 */
router.get("/", asyncHandler(
    async(req, res) => {
            const authorsList = await Author.find().sort({firstname: 1}).select("firstname lastname");
            res.json(authorsList)}
        ))

/**
 * @disc   Get author by id
 * @route  /api/authors/:id
 * @method GET
 * @access public
 */
router.get("/:id", asyncHandler(
    async (req, res) => {
            const author = await Author.findById(req.params.id);
            if(author) return res.status(200).json(author)
            res.status(404).json({message: "Author not found"})
        })) 
/**
 * @disc   Create New Author
 * @route  /api/authors
 * @method GET
 * @access Private (only admin)
 */
router.post("/", verifyTokenAndAdmin, asyncHandler(
    async(req, res) => {
        const {error} = validateAuthor(req.body);
        if(error) return res.status(400).json({message: error.details[0].message});
            const author = new Author({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                nationality: req.body.nationality,
                image: req.body.image
            })
            const result = await author.save();
            res.status(201).json(result)
       }))

/**
 * @disc   Update a author
 * @route  /api/authors/:id
 * @method PUT
 * @access Private (only admin)
 */
router.put("/:id", verifyTokenAndAdmin, asyncHandler(
    async(req, res) => {
        const {error} = validateUpdateAuthor(req.body);
        if(error) return res.status(400).json({message: error.details[0].message});
        const author = await Author.findByIdAndUpdate(req.params.id, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                nationality: req.body.nationality,
                image: req.body.image
            }})
        if(author) return res.status(200).json({message: "Author has been Updated"})
        res.status(404).json({message: "Author not found"})    
    }))
 
/**
 * @disc   Delete a author
 * @route  /api/authors/:id
 * @method Delete
 * @access Private (only admin)
 */
router.delete("/:id", verifyTokenAndAdmin, async(req, res) => {

    const author = await Author.findByIdAndDelete(req.params.id)
    
    if(author) return res.status(200).json({message: "Author has been Deleted"})
    res.status(404).json({message: "Author not found"})
    
})


module.exports = router;