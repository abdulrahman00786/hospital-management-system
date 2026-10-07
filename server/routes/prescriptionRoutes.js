const express = require("express");

const router = express.Router();


const {

    addPrescription,

    getPrescriptions,

    getPrescriptionById,

    updatePrescription,

    deletePrescription


} = require("../controllers/prescriptionController");


router.post("/", addPrescription);


router.get("/", getPrescriptions);


router.get("/:id", getPrescriptionById);


router.put("/:id", updatePrescription);


router.delete("/:id", deletePrescription);

module.exports = router;