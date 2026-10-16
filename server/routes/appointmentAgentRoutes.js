
const Appointment = require("../models/Appointment");

async function appointmentAgent(req, res) {
    try {
        const { appointmentId, action, confirmed } = req.body;

        // Input validation
        if (
            !appointmentId ||
            !Number.isInteger(Number(appointmentId)) ||
            Number(appointmentId) < 1 ||
            !action
        ) {
            return res.status(400).json({
                success: false,
                message: "Valid Appointment ID aur action dena zaroori hai."
            });
        }

        const allowedActions = ["view", "approve", "cancel"];

        if (!allowedActions.includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Action view, approve ya cancel hona chahiye."
            });
        }

        // Database se appointment find karo
        const appointment = await Appointment.findByPk(
            Number(appointmentId)
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment nahi mili."
            });
        }

        // VIEW: Sirf details show karo, koi update nahi
        if (action === "view") {
            return res.json({
                success: true,
                message: "Appointment details mil gayi hain.",
                appointment: {
                    id: appointment.id,
                    patientId: appointment.patientId,
                    doctorId: appointment.doctorId,
                    date: appointment.appointmentDate,
                    time: appointment.appointmentTime,
                    status: appointment.status
                }
            });
        }

        // Cancelled appointment ko approve nahi kar sakte
        if (
            action === "approve" &&
            appointment.status === "cancelled"
        ) {
            return res.status(400).json({
                success: false,
                message: "Cancelled appointment ko pehle dobara schedule karein."
            });
        }

        // Already cancelled
        if (
            action === "cancel" &&
            appointment.status === "cancelled"
        ) {
            return res.json({
                success: true,
                message: "Ye appointment pehle hi cancel ho chuki hai."
            });
        }

        // Already approved
        if (
            action === "approve" &&
            appointment.status === "approved"
        ) {
            return res.json({
                success: true,
                message: "Ye appointment pehle hi approve hai."
            });
        }

        // Confirmation required before changing status
        if (confirmed !== true) {
            return res.json({
                success: true,
                confirmationRequired: true,
                appointment: {
                    id: appointment.id,
                    patientId: appointment.patientId,
                    doctorId: appointment.doctorId,
                    date: appointment.appointmentDate,
                    time: appointment.appointmentTime,
                    currentStatus: appointment.status
                },
                proposedAction: action,
                message:
                    "Appointment ID " + appointment.id +
                    " ko " + action +
                    " karna hai. Barah-e-karam confirm karein."
            });
        }

        // Confirm hone ke baad status update
        appointment.status =
            action === "approve" ? "approved" : "cancelled";

        await appointment.save();

        return res.json({
            success: true,
            message:
                "Appointment ID " + appointment.id +
                " successfully " +
                (action === "approve" ? "approved." : "cancelled."),
            appointment: {
                id: appointment.id,
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                date: appointment.appointmentDate,
                time: appointment.appointmentTime,
                status: appointment.status
            }
        });

    } catch (error) {
        console.error("Appointment Agent Error:", error);

        return res.status(500).json({
            success: false,
            message: "Appointment agent se request complete nahi ho saki."
        });
    }
}

module.exports = appointmentAgent;
