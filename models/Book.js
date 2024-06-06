const mongoose = require("mongoose");
const joi = require("joi");

const BookSchema = new mongoose.Schema({
    title: {
        type : String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:200
    },
    author: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Author"
    },
    description: {
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:1000
    },
    prise: {
        type:Number,
        required:true,
        min:0
    },
    cover: {
        type:String,
        required:true,
        trim:true
    }
},{
    timestamps: true
})

const Book = mongoose.model("Book",BookSchema);

// Validate Create Book function 
function validateCreateBook(obj){
    const schema = joi.object({
        title: joi.string().trim().min(3).max(200).required(),
        author: joi.string().trim().min(3).max(200).required(),
        description: joi.string().trim().min(3).max(1000).required(),
        prise: joi.number().min(0).required(),
        cover: joi.string().trim().required()
    })
    return schema.validate(obj);
}

// Validate Update Book function 
function validateUpdateBook(obj){
    const schema = joi.object({
        title: joi.string().trim().min(3).max(200),
        author: joi.string().trim().min(3).max(200),
        description: joi.string().trim().min(3).max(1000),
        prise: joi.number().min(0),
        cover: joi.string().trim()
    })
   
    return schema.validate(obj);
}

module.exports = {
    Book,
    validateCreateBook,
    validateUpdateBook
}
