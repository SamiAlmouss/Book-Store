
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.headers.token;
    if (token) {
      try {
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       req.user = decoded;
       next();
      } catch (error) {
        return res.status(401).json("Invalid Token!");
      }

    } else {
        return res.status(401).json("No Token Provided!");
    }
}

function verifyTokenAndAuthorization(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json("You are not alowed to do that!");
        }
    })
}

function verifyTokenAndAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {  
            res.status(403).json("You are not alowed to do that!");
        }
    })
}


module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
  }