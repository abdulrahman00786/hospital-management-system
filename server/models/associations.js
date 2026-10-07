const Doctor = require("./Doctor");
const Patient = require("./Patient");
const Appointment = require("./Appointment");
const Prescription = require("./PrescriptionModel");




Doctor.hasMany(Appointment,{
    foreignKey:"doctorId"
});


Appointment.belongsTo(Doctor,{
    foreignKey:"doctorId"
});



Patient.hasMany(Appointment,{
    foreignKey:"patientId"
});


Appointment.belongsTo(Patient,{
    foreignKey:"patientId"
});







Doctor.hasMany(Prescription,{
    foreignKey:"doctorId"
});


Prescription.belongsTo(Doctor,{
    foreignKey:"doctorId"
});



Patient.hasMany(Prescription,{
    foreignKey:"patientId"
});


Prescription.belongsTo(Patient,{
    foreignKey:"patientId"
});


module.exports = {
    Doctor,
    Patient,
    Appointment,
    Prescription
};