const MedicalRecord = require("../models/MedicalRecord");




const addMedicalRecord = async (req, res) => {

    try {

        const record = await MedicalRecord.create(req.body);


        res.status(201).json({

            success:true,
            message:"Medical Record Added Successfully",
            data:record

        });


    } catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};






const getMedicalRecords = async (req,res)=>{

    try{

        const records = await MedicalRecord.findAll();


        res.json({

            success:true,
            data:records

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};







const getMedicalRecordById = async(req,res)=>{

    try{


        const record = await MedicalRecord.findByPk(req.params.id);



        if(!record){

            return res.status(404).json({

                success:false,
                message:"Medical Record Not Found"

            });

        }



        res.json({

            success:true,
            data:record

        });



    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};







const updateMedicalRecord = async(req,res)=>{

    try{


        const record = await MedicalRecord.findByPk(req.params.id);



        if(!record){

            return res.status(404).json({

                success:false,
                message:"Medical Record Not Found"

            });

        }



        await record.update(req.body);



        res.json({

            success:true,
            message:"Medical Record Updated Successfully",
            data:record

        });



    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};







const deleteMedicalRecord = async(req,res)=>{

    try{


        const record = await MedicalRecord.findByPk(req.params.id);



        if(!record){

            return res.status(404).json({

                success:false,
                message:"Medical Record Not Found"

            });

        }



        await record.destroy();



        res.json({

            success:true,
            message:"Medical Record Deleted Successfully"

        });



    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};





module.exports = {

    addMedicalRecord,
    getMedicalRecords,
    getMedicalRecordById,
    updateMedicalRecord,
    deleteMedicalRecord

};