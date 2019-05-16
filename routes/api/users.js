const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport")

const jsonParser = bodyParser.json();

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

// @route   post /api/users/login
// @desc   Login user / Return JWT Token
// @access   Public
router.post("/login", jsonParser, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //find user by eail
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User could not be found." });
    }

    //check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //create jwt payload
        //sign token
        //3600 expires the key after an hour so user needs to sign back in
        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          });
      } else {
        return res.status(400).json({ password: "Password incorrect!" });
      }
    });
  });
});

// @route   GET  api/users/current
// @desc   Return current user
// @access   Private
router.get("/current", passport.authenticate("jwt", {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  })
})


module.exports = router;
