const mongoose = require("mongoose");

async function connectDB() {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected ... ✔︎");
    } catch (err) {
        console.log("Connection failed to MongoDB !! ", err);
    }
   
}

module.exports = connectDB