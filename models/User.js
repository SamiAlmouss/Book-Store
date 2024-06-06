const mongoose = require("mongoose");
const joi = require("joi");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:5,
        maxlength:100,
        unique:true
    },
    username:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:200
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{
    timestamps: true
});


UserSchema.methods.generateToken = function(){
    return  jwt.sign({id: this._id, isAdmin: this.isAdmin}, process.env.JWT_SECRET);
}
const User = mongoose.model("User",UserSchema);
// Validate Register User
function validateRegisterUser(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
        username: joi.string().trim().min(2).max(200).required(),
        password: joi.string().trim().min(6).required(),
    })
    return schema.validate(obj)
}

// Validate Login User
function validateLoginUser(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(200).required().email(),
        password: joi.string().trim().min(6).required(),
    })
    return schema.validate(obj)
}

// Validate Update User
function validateUpdateUser(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).email(),
        username: joi.string().trim().min(2).max(200),
        password: joi.string().trim().min(6),
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser
    
}