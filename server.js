const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const passport = require('passport')
const path = require('path')

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

//passport middleware
app.use(passport.initialize());

//passport config
require("./config/passport")(passport);

//Use Routes
app.use("/api/users", users)
app.use("/api/profile", profile)
app.use("/api/posts", posts)

//the below code is needed to run in production with react build
//Server static assets if in production
if(process.env.NODE_ENV === "production"){
  // set static folder
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server is running on port " + port));
