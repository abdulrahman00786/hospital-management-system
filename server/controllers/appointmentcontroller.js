const Appointment = require("../models/Appointment");




const createAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.create(req.body);


        res.status(201).json({

            success: true,
            message: "Appointment Booked Successfully",
            data: appointment

        });


    } catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};





const getAppointments = async (req, res) => {

    try {

        const appointments = await Appointment.findAll();


        res.json({

            success: true,
            data: appointments

        });


    } catch (error) {

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};





const getAppointmentById = async (req,res)=>{

    try{


        const appointment = await Appointment.findByPk(req.params.id);



        if(!appointment){

            return res.status(404).json({

                success:false,
                message:"Appointment Not Found"

            });

        }



        res.json({

            success:true,
            data:appointment

        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};






const updateAppointment = async(req,res)=>{

    try{


        const appointment = await Appointment.findByPk(req.params.id);



        if(!appointment){

            return res.status(404).json({

                success:false,
                message:"Appointment Not Found"

            });

        }



        await appointment.update(req.body);



        res.json({

            success:true,
            message:"Appointment Updated Successfully",
            data:appointment

        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};







const deleteAppointment = async(req,res)=>{


    try{


        const appointment = await Appointment.findByPk(req.params.id);



        if(!appointment){

            return res.status(404).json({

                success:false,
                message:"Appointment Not Found"

            });

        }



        await appointment.destroy();



        res.json({

            success:true,
            message:"Appointment Deleted Successfully"

        });



    }catch(error){


        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};





module.exports = {

    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment

};