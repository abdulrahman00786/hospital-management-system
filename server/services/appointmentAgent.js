const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");

async function appointmentAgent(req, res) {
    try {
        const { appointmentId, action, confirmed } = req.body;

        if (!appointmentId || !action) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID aur action dena zaroori hai."
            });
        }

        if (!["approve", "cancel", "view"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action view, approve ya cancel hona chahiye."
            });
        }

        const appointment = await Appointment.findByPk(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment nahi mili."
            });
        }

        const patient = await Patient.findByPk(appointment.patientId);
        const doctor = await Doctor.findByPk(appointment.doctorId);

        const details = {
            id: appointment.id,
            patientId: appointment.patientId,
            patientName: patient ? patient.name : "Not found",
            doctorId: appointment.doctorId,
            doctorName: doctor ? doctor.name : "Not found",
            date: appointment.appointmentDate,
            time: appointment.appointmentTime,
            status: appointment.status
        };

        if (action === "view") {
            return res.json({
                success: true,
                message: "Appointment details",
                appointment: details
            });
        }

        if (action === "approve" && appointment.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled appointment ko pehle dobara schedule karein."
            });
        }

        if (action === "cancel" && appointment.status === "cancelled") {
            return res.json({
                success: true,
                message: "Ye appointment pehle hi cancel ho chuki hai.",
                appointment: details
            });
        }

        if (action === "approve" && appointment.status === "approved") {
            return res.json({
                success: true,
                message: "Ye appointment pehle hi approve hai.",
                appointment: details
            });
        }

        if (confirmed !== true) {
            return res.json({
                success: true,
                confirmationRequired: true,
                appointment: details,
                proposedAction: action,
                message:
                    "Appointment ID " + appointment.id +
                    " ko " + action + " karna hai. Barah-e-karam confirm karein."
            });
        }

        appointment.status =
            action === "approve" ? "approved" : "cancelled";

        await appointment.save();

        details.status = appointment.status;

        return res.json({
            success: true,
            message:
                "Appointment ID " + appointment.id +
                " successfully " +
                (action === "approve" ? "approved." : "cancelled."),
            appointment: details
        });

    } catch (error) {
        console.error("Appointment Agent Error:", error);

        return res.status(500).json({
            success: false,
            message: "Appointment update nahi ho saki."
        });
    }
}

module.exports = appointmentAgent;