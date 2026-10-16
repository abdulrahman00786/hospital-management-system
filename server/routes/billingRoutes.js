const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    addBilling,
    getBillings,
    deleteBilling
} = require("../controllers/billingController");

router.use(authMiddleware);

router.post("/", addBilling);
router.get("/", getBillings);
router.delete("/:id", deleteBilling);

module.exports = router;