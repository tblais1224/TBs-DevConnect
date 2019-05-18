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
//bring in profile model
const Profile = require("../../models/Profile");

// @route   GET /api/posts/test
// @desc   Tests posts route
// @access   Public
router.get("/test", (req, res) =>
  res.json({ messaage: "Posts route is functional" })
);

// @route   GET /api/posts
// @desc   get posts
// @access   Public
router.get("/", (req, res) => {
  //this finds posts and sorts them by the most recent date
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ error: "No posts could be found!" }));
});

// @route   GET /api/posts/:id
// @desc   get post by id
// @access   Public
router.get("/:id", (req, res) => {
  //this finds posts and sorts them by the most recent date
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ error: "No post found with that id!" })
    );
});

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

// @route   DELETE /api/posts/:id
// @desc   delete a post by id
// @access   private
router.delete(
  "/:id",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //check user ids to make sure backend server is secure
        if (post.user.toString() !== req.user.id) {
          //if user ids do not match return 401 which means not authorized
          return res
            .status(401)
            .json({ notauthorized: "User not authorized!" });
        }
        // delete post
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err => res.status(404).json({ error: "No post found!" }));
      });
    });
  }
);

module.exports = router;
