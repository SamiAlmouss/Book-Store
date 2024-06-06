
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {User,validateUpdateUser} = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../middlewares/verifyToken");

/**
 * @disc   Update User
 * @route  /api/users/:id
 * @method PUT
 * @access Private
 *  
 */
router.put("/:id", verifyTokenAndAuthorization, asyncHandler(async(req, res) => {
    const {error} = validateUpdateUser(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});
    if(req.body.password){
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }
    },{new: true});
    res.status(200).json(updatedUser);
   
}))

/**
 * @disc   Get All Users
 * @route  /api/users
 * @method GET
 * @access Private (only admin)
 *  
 */

router.get("/", verifyTokenAndAdmin, asyncHandler(async(req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
}))

/**
 * @disc   Get User By Id
 * @route  /api/users/:id
 * @method GET
 * @access Private (only admin and self)
 *  
 */
router.get("/:id", verifyTokenAndAuthorization, asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if(!user) return res.status(404).json({message: "User not found"});
    res.status(200).json(user);
   
}))

/**
 * @disc   Delete User
 * @route  /api/users/:id
 * @method DELETE
 * @access Private (only admin and self)
 *  
 */
router.delete("/:id", verifyTokenAndAuthorization, asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if(!user) return res.status(404).json({message: "User not found"});
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({message: "User has been deleted"});
   
}))

module.exports = router;