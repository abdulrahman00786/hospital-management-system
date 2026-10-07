const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const Billing = require("../models/Billing");





const getDashboard = async(req,res)=>{


try{


const doctors = await Doctor.count();


const patients = await Patient.count();


const appointments = await Appointment.count();







const bills = await Billing.findAll();


let revenue = 0;


bills.forEach((bill)=>{


    revenue += Number(bill.amount);


});









const recentPatients = await Patient.findAll({

    limit:5,

    order:[
        ["createdAt","DESC"]
    ]

});









const recentAppointments = await Appointment.findAll({

    limit:5,

    order:[
        ["createdAt","DESC"]
    ]

});









const recentBills = await Billing.findAll({

    limit:5,

    order:[
        ["createdAt","DESC"]
    ]

});







res.json({


success:true,


data:{


doctors,

patients,

appointments,

revenue,


recentPatients,


recentAppointments,


recentBills



}



});




}
catch(error){


res.status(500).json({


success:false,

message:error.message


});


}



};





module.exports = {

getDashboard

};