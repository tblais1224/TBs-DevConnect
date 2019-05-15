const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser")

const jsonParser = bodyParser.json()

//Load user model
const User = require("../../models/User");

// @route   GET /api/users/test
// @desc   Tests users route
// @access   Public
router.get("/test", (req, res) =>
  res.json({ messaage: "Users route is functional" })
);

// @route   post /api/users/register
// @desc   Register user
// @access   Public
router.post("/register", jsonParser, (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists!" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", //size
        r: "r", //Rating
        d: "mm" //Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        //in ES6 avatar, is the same as avatar: avatar,
        avatar,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
