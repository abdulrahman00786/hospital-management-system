const Prescription = require("../models/PrescriptionModel");





const addPrescription = async(req,res)=>{

    try{


        const prescription = await Prescription.create(req.body);


        res.status(201).json({

            success:true,

            message:"Prescription Added Successfully",

            data:prescription

        });



    }catch(error){


        console.log("Prescription Error:",error.message);


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};






const getPrescriptions = async(req,res)=>{

    try{


        const prescriptions = await Prescription.findAll();



        res.json({

            success:true,

            data:prescriptions

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};






const getPrescriptionById = async(req,res)=>{

    try{


        const prescription = await Prescription.findByPk(
            req.params.id
        );


        if(!prescription){

            return res.status(404).json({

                success:false,

                message:"Prescription Not Found"

            });

        }



        res.json({

            success:true,

            data:prescription

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};







const updatePrescription = async(req,res)=>{

    try{


        const prescription = await Prescription.findByPk(
            req.params.id
        );


        if(!prescription){

            return res.status(404).json({

                success:false,

                message:"Prescription Not Found"

            });

        }



        await prescription.update(req.body);



        res.json({

            success:true,

            message:"Prescription Updated Successfully",

            data:prescription

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};







const deletePrescription = async(req,res)=>{

    try{


        const prescription = await Prescription.findByPk(
            req.params.id
        );


        if(!prescription){

            return res.status(404).json({

                success:false,

                message:"Prescription Not Found"

            });

        }



        await prescription.destroy();



        res.json({

            success:true,

            message:"Prescription Deleted Successfully"

        });



    }catch(error){


        res.status(500).json({

            success:false,

            message:error.message

        });


    }

};





module.exports={

    addPrescription,

    getPrescriptions,

    getPrescriptionById,

    updatePrescription,

    deletePrescription

};