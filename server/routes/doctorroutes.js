const express = require("express");

const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    addDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    uploadDoctorImage
} = require("../controllers/doctorController");


router.post("/", addDoctor);



router.get("/", getDoctors);


router.get("/:id", getDoctorById);



router.put("/:id", updateDoctor);



router.delete("/:id", deleteDoctor);



router.post(
    "/upload/:id",
    upload.single("image"),
    uploadDoctorImage
);


module.exports = router;