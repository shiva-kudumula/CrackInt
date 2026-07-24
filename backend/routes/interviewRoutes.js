const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authenticateToken");

const {
    createInterview,
    submitInterview,
    getInterviews
} = require("../controllers/interviewController");

router.post(
    "/interview",
    authenticateToken,
    createInterview
);

router.post(
    "/submit-interview",
    authenticateToken,
    submitInterview
);

router.get(
    "/interviews",
    authenticateToken,
    getInterviews
);

module.exports = router;