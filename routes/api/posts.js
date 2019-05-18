const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();

//post validation
const validatePostInput = require("../../validation/post");

//bring in post model
const Post = require("../../models/Post");

// @route   GET /api/posts/test
// @desc   Tests posts route
// @access   Public
router.get("/test", (req, res) =>
  res.json({ messaage: "Posts route is functional" })
);

// @route   POST /api/posts
// @desc   Create a post
// @access   private
router.post(
  "/",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    //check validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    //save the post then return the post
    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
