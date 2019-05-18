const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

mongoose.set("useFindAndModify", false);

//lod validations
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//load the Profile schema
const Profile = require("../../models/Profile");
// Load the User schema
const User = require("../../models/User");

// @route   GET /api/profile/test
// @desc   Tests profile route
// @access   Public
router.get("/test", (req, res) =>
  res.json({
    message: "Profile route is functional"
  })
);

// @route   GET /api/profile/
// @desc   get current users profile if logged in
// @access   Private
router.get(
  "/",
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const errors = {};

    Profile.findOne({
      user: req.user.id
    })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user!";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   GET api/profile/all
// @desc   get all profiles
// @access   public
router.get("/all", (req, res) => {
  //intitialize erros object
  const errors = {};
  //matches to handle in database
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then(profiles => {
      if (!profiles) {
        errors.noprofile = "No profiles could be found!";
        return res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json({ profiles: "No profiles exist." }));
});

// @route   GET api/profile/handle/:handle
// @desc   get profile by handle. this is a backend api route
// @access   public
router.get("/handle/:handle", (req, res) => {
  //intitialize erros object
  const errors = {};
  //matches to handle in database
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is not profile for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});
//test with Tom te Blais

// @route   GET api/profile/user/:user_id
// @desc   get profile by user_id. this is a backend api route
// @access   public
router.get("/user/:user_id", (req, res) => {
  //intitialize erros object
  const errors = {};
  //matches to handle in database
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then(profile => {
      if (!profile) {
        errors.noprofile = "There is not profile for this user.";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err =>
      res.status(404).json({ profile: "No profile exists for this user." })
    );
});

// @route   Post /api/profile/
// @desc   create or edit user profile
// @access   Private
router.post(
  "/",
  jsonParser,
  passport.authenticate("jwt", {
    session: false
  }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //check validation
    if (!isValid) {
      //return any errors with a 400 status
      return res.status(400).json(errors);
    }

    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    //if handle exists set it profileFields
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //skills , split into an array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({
      user: req.user.id
    }).then(profile => {
      if (profile) {
        // Update profile
        Profile.findOneAndUpdate(
          {
            user: req.user.id
          },
          {
            $set: profileFields
          },
          {
            new: true
          }
        ).then(profile => res.json(profile));
      } else {
        // Create profile

        //check if handle exists
        Profile.findOne({
          handle: profileFields.handle
        }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists.";
            res.status(400).json(errors);
          }

          //save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

// @route   Post /api/profile/experience
// @desc   add experience to profile
// @access   Private
router.post(
  "/experience",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    //check validation
    if (!isValid) {
      //return any errors with a 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExperience = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //add to experience array in profile
      profile.experience.unshift(newExperience);
      //save profile and then return updated profile
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   Post /api/profile/education
// @desc   add education to profile
// @access   Private
router.post(
  "/education",
  jsonParser,
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    //check validation
    if (!isValid) {
      //return any errors with a 400 status
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEducation = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };
      //add to experience array in profile
      profile.education.unshift(newEducation);
      //save profile and then return updated profile
      profile.save().then(profile => res.json(profile));
    });
  }
);

// @route   delete /api/profile/experience/:exp_id
// @desc   delete experience from the profile
// @access   Private
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index from profile experiences
        const removeIndex = profile.experience
          .map(item => item.id)
          .indexOf(req.params.exp_id);

        //splice the matched exp_id from the array
        profile.experience.splice(removeIndex, 1);

        // save and output updated profile
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   delete /api/profile/education/:edu_id
// @desc   delete education from profile
// @access   Private
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // get remove index from profile educations
        const removeIndex = profile.education
          .map(item => item.id)
          .indexOf(req.params.edu_id);

        //splice the matched exp_id from the array
        profile.education.splice(removeIndex, 1);

        // save and output updated profile
        profile.save().then(profile => res.json(profile));
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   delete /api/profile
// @desc   delete user and profile
// @access   Private
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //this finds user profile by current user id and deletes from db
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      //this finds the user and deletes it in db
      User.findOneAndRemove({ _id: req.user.id }).then(() => {res.json({success: true})});
    });
  }
);

module.exports = router;
