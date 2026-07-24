const express = require("express");
const { createStreamingToken } = require("../controllers/speechController.js");

const router = express.Router();

router.get("/speech-token", createStreamingToken);

module.exports = router;
