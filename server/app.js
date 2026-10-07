const express = require("express");
const cors = require("cors");
require("dotenv").config();


const sequelize = require("./database/connection");


const app = express();

require("./models/Doctor");

require("./models/Patient");

require("./models/Appointment");

require("./models/PrescriptionModel");

require("./models/Billing");

require("./models/User");

const doctorRoutes = require("./routes/doctorRoutes");

const patientRoutes = require("./routes/patientRoutes");

const appointmentRoutes = require("./routes/appointmentRoutes");

const prescriptionRoutes = require("./routes/prescriptionRoutes");

const billingRoutes = require("./routes/billingRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");

const userRoutes = require("./routes/userRoutes");

app.use(cors());

app.use(express.json());

app.get("/",(req,res)=>{


    res.json({

        success:true,

        message:"🏥 Hospital Management System API Running Successfully"

    });


});

app.use(
    "/api/doctors",
    doctorRoutes
);



app.use(
    "/api/patients",
    patientRoutes
);



app.use(
    "/api/appointments",
    appointmentRoutes
);



app.use(
    "/api/prescriptions",
    prescriptionRoutes
);



app.use(
    "/api/billing",
    billingRoutes
);



app.use(
    "/api/dashboard",
    dashboardRoutes
);



app.use(
    "/api/users",
    userRoutes
);

sequelize.authenticate()

.then(()=>{


    console.log("✅ Database Connected Successfully");


    return sequelize.sync({alter:true});


})


.then(()=>{


    console.log("✅ All Tables Created Successfully");


})


.catch((error)=>{


    console.log(
        "Database Error:",
        error.message
    );


});


const PORT = process.env.PORT || 5000;



app.listen(PORT,()=>{


    console.log(
        `🚀 Server is running on http://localhost:${PORT}`
    );


});