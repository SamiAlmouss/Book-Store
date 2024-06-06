const mongoose = require("mongoose");
const joi = require("joi");

const AuthorSchema = new mongoose.Schema({
    firstname: {
        type : String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    lastname: {
        type : String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    nationality: {
        type : String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    image: {
        type : String,
        default: "defult-image-avatar.png",
        trim: true,
        minlength: 3,
        maxlength: 200
    }
},{
    timestamps: true
})

const Author = mongoose.model("Author", AuthorSchema);

function validateAuthor(obj) {
    const schema = joi.object({
        firstname: joi.string().min(3).required(),
        lastname: joi.string().min(3).required(),
        nationality: joi.string().min(3).required(),
        image: joi.string()
    })
    return schema.validate(obj)
}
function validateUpdateAuthor(obj) {
    const schema =  joi.object({
        firstname: joi.string().min(3),
        lastname: joi.string().min(3),
        age: joi.number().min(13).max(200)
    })
    return schema.validate(obj)
}

module.exports = {
    Author,
    validateAuthor,
    validateUpdateAuthor
}