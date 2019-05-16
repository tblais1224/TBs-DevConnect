const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const passport = require("passport")

//load the Profile schema
const Profile = require("../../models/Profile")
// Load the User schema
const User = require("../../models/User")

// @route   GET /api/profile/test
// @desc   Tests profile route
// @access   Public
router.get("/test", (req, res) =>
  res.json({
    messaage: "Profile route is functional"
  })
);

// @route   GET /api/profile/
// @desc   get current users profile if logged in
// @access   Private
router.get("/", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  const errors = {}

  Profile.findOne({
      user: req.user.id
    })
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user!"
        return res.status(404).json(errors)
      }
    }).catch(err => res.status(404).json(err))
})
// @route   Post /api/profile/
// @desc   create or edit user profile
// @access   Private
router.post("/", passport.authenticate("jwt", {
  session: false
}), (req, res) => {
  //Get Fields
  const profileFields = {}
  profileFields.user = req.user.id
  //if handle exists set it profileFields
  if (req.body.handle) profileFields.handle = req.body.handle
  if (req.body.company) profileFields.company = req.body.company
  if (req.body.website) profileFields.website = req.body.website
  if (req.body.location) profileFields.location = req.body.location
  if (req.body.bio) profileFields.bio = req.body.bio
  if (req.body.status) profileFields.status = req.body.status
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername
  //skills , split into an array
  if (typeof req.body.skills !== "undefined") {
    profileFields.skills = req.body.skills.split(",")
  }
  //social
  profileFields.social = {}
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram

  Profile.findOne({
    user: req.user.id
  }).then(profile => {
    if (profile) {
      // Update profile
      Profile.findOneAndUpdate({
        user: req.user.id
      }, {
        $set: profileFields
      }, {
        new: true
      }).then(profile => res.json(profile))
    } else {
      // Create profile

      //check if handle exists
      Profile.findOne({
        handle: profileFields.handle
      }).then(profile => {
        if (profile) {
          errors.handle = "That handle already exists."
          res.status(400).json(errors)
        }

        //save Profile
        new Profile(profileFields).save().then(profile => res.json(profile))
      })
    }
  })
})


module.exports = router;