const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    addPrescription,
    getPrescriptions,
    getPrescriptionById,
    updatePrescription,
    deletePrescription
} = require("../controllers/prescriptionController");

router.use(authMiddleware);

router.post("/", addPrescription);
router.get("/", getPrescriptions);
router.get("/:id", getPrescriptionById);
router.put("/:id", updatePrescription);
router.delete("/:id", deletePrescription);

module.exports = router;