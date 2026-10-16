
const express = require("express");
const router = express.Router();

const aiAssistant = require("../services/aiAssistant");

router.post("/", aiAssistant);

module.exports = router;
