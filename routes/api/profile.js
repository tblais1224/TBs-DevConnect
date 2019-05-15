const express = require("express");
const router = express.Router();



// @route   GET /api/profile/test
// @desc   Tests profile route
// @access   Public
router.get("/test", (req, res) =>
  res.json({ messaage: "Profile route is functional" })
);

module.exports = router;