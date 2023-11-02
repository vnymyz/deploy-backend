const express = require("express");
const router = express.Router();
const { createFeedback } = require("../controllers/feedBackController");

// adoptcat routes for the post
router.post("/feedback/create", createFeedback);

module.exports = router;
