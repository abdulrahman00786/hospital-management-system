
const Appointment = require("../models/Appointment");

const createAppointment = async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            appointmentDate,
            appointmentTime
        } = req.body;

        // Required fields validation
        if (
            !patientId ||
            !doctorId ||
            !appointmentDate ||
            !appointmentTime
        ) {
            return res.status(400).json({
                success: false,
                message: "Patient ID, Doctor ID, date aur time zaroori hain."
            });
        }

        // IDs validation
        if (
            !Number.isInteger(Number(patientId)) ||
            Number(patientId) < 1 ||
            !Number.isInteger(Number(doctorId)) ||
            Number(doctorId) < 1
        ) {
            return res.status(400).json({
                success: false,
                message: "Patient ID aur Doctor ID valid positive numbers honi chahiye."
            });
        }

        // Date format validation: YYYY-MM-DD
        if (
            typeof appointmentDate !== "string" ||
            !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate)
        ) {
            return res.status(400).json({
                success: false,
                message: "Date YYYY-MM-DD format mein honi chahiye."
            });
        }

        const [year, month, day] = appointmentDate
            .split("-")
            .map(Number);

        const dateCheck = new Date(
            Date.UTC(year, month - 1, day)
        );

        if (
            dateCheck.getUTCFullYear() !== year ||
            dateCheck.getUTCMonth() !== month - 1 ||
            dateCheck.getUTCDate() !== day
        ) {
            return res.status(400).json({
                success: false,
                message: "Appointment ki date valid nahi hai."
            });
        }

        // Past date validation
        const today = new Date();
        const todayString =
            `${today.getFullYear()}-` +
            `${String(today.getMonth() + 1).padStart(2, "0")}-` +
            `${String(today.getDate()).padStart(2, "0")}`;

        if (appointmentDate < todayString) {
            return res.status(400).json({
                success: false,
                message: "Appointment ki date aaj ya future ki honi chahiye."
            });
        }

        // Time validation: HH:MM
        if (
            typeof appointmentTime !== "string" ||
            !/^([01]\d|2[0-3]):[0-5]\d$/.test(appointmentTime)
        ) {
            return res.status(400).json({
                success: false,
                message: "Appointment ka time valid select karein."
            });
        }

        // Appointment hamesha pending status se start hogi
        const appointment = await Appointment.create({
            patientId: Number(patientId),
            doctorId: Number(doctorId),
            appointmentDate,
            appointmentTime,
            status: "pending"
        });

        return res.status(201).json({
            success: true,
            message: "Appointment successfully booked.",
            data: appointment
        });

    } catch (error) {
        console.error("Create Appointment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Appointment book nahi ho saki."
        });
    }
};


const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.findAll({
            order: [["id", "DESC"]]
        });

        return res.json({
            success: true,
            data: appointments
        });

    } catch (error) {
        console.error("Get Appointments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Appointments load nahi ho sakin."
        });
    }
};


const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment nahi mili."
            });
        }

        return res.json({
            success: true,
            data: appointment
        });

    } catch (error) {
        console.error("Get Appointment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Appointment load nahi ho saki."
        });
    }
};


const updateAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment nahi mili."
            });
        }

        const allowedStatuses = [
            "pending",
            "approved",
            "completed",
            "cancelled"
        ];

        if (
            req.body.status &&
            !allowedStatuses.includes(req.body.status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Appointment status valid nahi hai."
            });
        }

        if (req.body.appointmentDate !== undefined) {
            const date = req.body.appointmentDate;

            if (
                typeof date !== "string" ||
                !/^\d{4}-\d{2}-\d{2}$/.test(date)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Date YYYY-MM-DD format mein honi chahiye."
                });
            }

            const [year, month, day] = date.split("-").map(Number);
            const check = new Date(Date.UTC(year, month - 1, day));

            if (
                check.getUTCFullYear() !== year ||
                check.getUTCMonth() !== month - 1 ||
                check.getUTCDate() !== day
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Appointment ki date valid nahi hai."
                });
            }

            const now = new Date();
            const today =
                `${now.getFullYear()}-` +
                `${String(now.getMonth() + 1).padStart(2, "0")}-` +
                `${String(now.getDate()).padStart(2, "0")}`;

            if (date < today) {
                return res.status(400).json({
                    success: false,
                    message: "Appointment ki date aaj ya future ki honi chahiye."
                });
            }
        }

        // Sirf allowed fields update hongi
        const updates = {};

        if (req.body.patientId !== undefined) {
            const id = Number(req.body.patientId);

            if (!Number.isInteger(id) || id < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Patient ID valid honi chahiye."
                });
            }

            updates.patientId = id;
        }

        if (req.body.doctorId !== undefined) {
            const id = Number(req.body.doctorId);

            if (!Number.isInteger(id) || id < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Doctor ID valid honi chahiye."
                });
            }

            updates.doctorId = id;
        }

        if (req.body.appointmentDate !== undefined) {
            updates.appointmentDate = req.body.appointmentDate;
        }

        if (req.body.appointmentTime !== undefined) {
            if (
                typeof req.body.appointmentTime !== "string" ||
                !/^([01]\d|2[0-3]):[0-5]\d$/.test(req.body.appointmentTime)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Appointment ka time valid nahi hai."
                });
            }

            updates.appointmentTime = req.body.appointmentTime;
        }

        if (req.body.status !== undefined) {
            updates.status = req.body.status;
        }

        await appointment.update(updates);

        return res.json({
            success: true,
            message: "Appointment successfully update ho gayi.",
            data: appointment
        });

    } catch (error) {
        console.error("Update Appointment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Appointment update nahi ho saki."
        });
    }
};


const deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment nahi mili."
            });
        }

        await appointment.destroy();

        return res.json({
            success: true,
            message: "Appointment successfully delete ho gayi."
        });

    } catch (error) {
        console.error("Delete Appointment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Appointment delete nahi ho saki."
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
