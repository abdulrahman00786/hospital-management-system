const Patient = require("../models/Patient");




const addPatient = async (req, res) => {

    try {

        const patient = await Patient.create(req.body);


        res.status(201).json({

            success: true,
            message: "Patient Added Successfully",
            data: patient

        });


    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};






const getPatients = async (req, res) => {

    try {

        const patients = await Patient.findAll();


        res.json({

            success: true,
            data: patients

        });


    } catch (error) {

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};






const getPatientById = async (req,res)=>{

    try{

        const patient = await Patient.findByPk(req.params.id);


        if(!patient){

            return res.status(404).json({

                success:false,
                message:"Patient Not Found"

            });

        }


        res.json({

            success:true,
            data:patient

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};







const updatePatient = async(req,res)=>{

    try{

        const patient = await Patient.findByPk(req.params.id);


        if(!patient){

            return res.status(404).json({

                success:false,
                message:"Patient Not Found"

            });

        }


        await patient.update(req.body);


        res.json({

            success:true,
            message:"Patient Updated Successfully",
            data:patient

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};







const deletePatient = async(req,res)=>{

    try{

        const patient = await Patient.findByPk(req.params.id);


        if(!patient){

            return res.status(404).json({

                success:false,
                message:"Patient Not Found"

            });

        }


        await patient.destroy();


        res.json({

            success:true,
            message:"Patient Deleted Successfully"

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};





module.exports = {

    addPatient,
    getPatients,
    getPatientById,
    updatePatient,
    deletePatient

};