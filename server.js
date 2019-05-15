const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")


const users = require("./routes/api/users")
const profile = require("./routes/api/profile")
const posts = require("./routes/api/posts")

const app = express();

//body-parser middleware
app.use(bodyParser.urlencoded({extended: false}))
//had to move bodyParser.json to users route page
// app.use(bodyParser.json)


// database config
const db = require("./config/keys").mongoURI;

//connect to mongo atlas database
mongoose.connect(db, {useNewUrlParser: true})
  .then(() => console.log("MongoDB has connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("hello world"));

//Use Routes
app.use("/api/users", users)
app.use("/api/profile", profile)
app.use("/api/posts", posts)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log("server is running on port " + port));
