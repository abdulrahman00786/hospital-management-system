const express = require("express");

const router = express.Router();


const {

    addMedicalRecord,
    getMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord

} = require("../controllers/medicalRecordController");

router.post("/", addMedicalRecord);

router.get("/", getMedicalRecords);

router.get("/:id", getMedicalRecordById);

router.put("/:id", updateMedicalRecord);

router.delete("/:id", deleteMedicalRecord);

module.exports = router;