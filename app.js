const express = require("express");
const app = express();
const { logger } = require("./middlewares/logger");
const {notFound ,errorHandler} = require("./middlewares/errors");
const mongoose = require("mongoose");
require("dotenv").config();;
const connectDB = require("./config/db");

connectDB();

app.use(express.static("views"));
app.use(logger);
    
app.use(express.json());
app.use("/api/books",require("./routes/books"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/authors",require("./routes/author"));
app.use("/api/users",require("./routes/users"));

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT} User: ${process.env.USER} ...`);
});















// app.get("/", (req, res) => {
//     res.sendFile("./views/home.html", {root: __dirname})
// })

// app.get("*", (req, res) => {
//   //  res.sendFile("./views/404.html", {root: __dirname})

//   res.status(404).json({message: "Page not found"})
// })