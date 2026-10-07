const Doctor = require("../models/Doctor");



const addDoctor = async (req, res) => {

    try {

        console.log("========== ADD DOCTOR API HIT ==========");
        console.log(req.body);

        const doctor = await Doctor.create({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            specialization: req.body.specialization,
            experience: Number(req.body.experience)
        });

        return res.status(201).json({
            success: true,
            message: "Doctor Added Successfully",
            data: doctor
        });

    } catch (error) {

        console.log("========== ADD DOCTOR ERROR ==========");
        console.log(error);

        
        if (error.name === "SequelizeUniqueConstraintError") {

            return res.status(400).json({
                success: false,
                message: "Email already exists. Please use another email."
            });

        }

       
        if (error.name === "SequelizeValidationError") {

            return res.status(400).json({
                success: false,
                message: error.errors[0].message
            });

        }

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



const getDoctors = async (req, res) => {

    try {

        const doctors = await Doctor.findAll();

        return res.json({
            success: true,
            data: doctors
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



const getDoctorById = async (req, res) => {

    try {

        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {

            return res.status(404).json({
                success: false,
                message: "Doctor Not Found"
            });

        }

        return res.json({
            success: true,
            data: doctor
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



const updateDoctor = async (req, res) => {

    try {

        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {

            return res.status(404).json({
                success: false,
                message: "Doctor Not Found"
            });

        }

        await doctor.update(req.body);

        return res.json({
            success: true,
            message: "Doctor Updated Successfully",
            data: doctor
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



const deleteDoctor = async (req, res) => {

    try {

        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {

            return res.status(404).json({
                success: false,
                message: "Doctor Not Found"
            });

        }

        await doctor.destroy();

        return res.json({
            success: true,
            message: "Doctor Deleted Successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



const uploadDoctorImage = async (req, res) => {

    try {

        const doctor = await Doctor.findByPk(req.params.id);

        if (!doctor) {

            return res.status(404).json({
                success: false,
                message: "Doctor Not Found"
            });

        }

        doctor.image = req.file.filename;

        await doctor.save();

        return res.json({
            success: true,
            message: "Doctor Image Uploaded Successfully",
            image: doctor.image
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



module.exports = {
    addDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    uploadDoctorImage
};