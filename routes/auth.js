const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const {User, validateRegisterUser, validateLoginUser} = require("../models/User");

const bcrypt = require("bcryptjs");

/**
 * @disc   Register New User
 * @route  /api/auth/register
 * @method POST
 * @access public
 *  
 */
router.post("/register", asyncHandler(async(req, res) => {
    const {error} = validateRegisterUser(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).json({message: "User already registered"});

    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    user = new User({ 
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    })
    const result = await user.save();
    const token = user.generateToken();
    const {password, ...others} = result._doc;
    res.status(201).json({...others,token});
}))

/**
 * @disc   Login User
 * @route  /api/auth/login
 * @method POST
 * @access Privete
 *  
 */
router.post("/login", asyncHandler(async(req, res) => {
    const {error} = validateLoginUser(req.body);
    if(error) return res.status(400).json({message: error.details[0].message});
   const user = await User.findOne({email: req.body.email});
   if(!user) return res.status(400).json({message: "Invalid Email or Password"});

   const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
    if (isPasswordMatch) {
        const token = user.generateToken();   
        const {password, ...others} = user._doc;
        res.status(200).json({...others,token});
    } else {
        res.status(400).json({message: "Invalid Email or Password"})
    }
   
}))
   

module.exports = router;