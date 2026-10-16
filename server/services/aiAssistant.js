
const { GoogleGenAI } = require("@google/genai");

const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const sleep = function (ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
};

const aiAssistant = async function (req, res) {
    try {
        const question = req.body.question;

        if (!question || !question.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please enter a question."
            });
        }

        const q = question.toLowerCase();

        const results = await Promise.all([
            Doctor.findAll({
                attributes: ["id", "name", "specialization"]
            }),
            Patient.findAll({
                attributes: ["id", "name"]
            }),
            Appointment.findAll({
                attributes: [
                    "id",
                    "patientId",
                    "doctorId",
                    "appointmentDate",
                    "appointmentTime",
                    "status"
                ],
                order: [["id", "DESC"]]
            })
        ]);

        const doctors = results[0];
        const patients = results[1];
        const appointments = results[2];

        const statusCounts = {
            pending: 0,
            approved: 0,
            completed: 0,
            cancelled: 0
        };

        appointments.forEach(function (a) {
            const status = String(a.status || "").toLowerCase();

            if (status === "pending") statusCounts.pending++;
            if (status === "approved") statusCounts.approved++;
            if (status === "completed") statusCounts.completed++;

            if (status === "cancelled" || status === "canceled") {
                statusCounts.cancelled++;
            }
        });

        // Today's date
        const now = new Date();

        const today =
            now.getFullYear() + "-" +
            String(now.getMonth() + 1).padStart(2, "0") + "-" +
            String(now.getDate()).padStart(2, "0");

        const todaysAppointments = appointments.filter(function (a) {
            return String(a.appointmentDate).slice(0, 10) === today;
        });

        // Reusable appointment details
        const getAppointmentDetails = function (list) {
            if (list.length === 0) {
                return "No appointments found.";
            }

            let answer = "Appointment Details:\n\n";

            list.forEach(function (a, index) {
                const patient = patients.find(function (p) {
                    return String(p.id) === String(a.patientId);
                });

                const doctor = doctors.find(function (d) {
                    return String(d.id) === String(a.doctorId);
                });

                answer +=
                    (index + 1) + ". Appointment ID: " + a.id + "\n" +
                    "Patient ID: " + a.patientId + "\n" +
                    "Patient: " + (patient ? patient.name : "Not found") + "\n" +
                    "Doctor ID: " + a.doctorId + "\n" +
                    "Doctor: " + (doctor ? doctor.name : "Not found") + "\n" +
                    "Date: " +
                    String(a.appointmentDate || "Not specified").slice(0, 10) + "\n" +
                    "Time: " + (a.appointmentTime || "Not specified") + "\n" +
                    "Status: " + (a.status || "Not specified") + "\n\n";
            });

            return answer;
        };

        // Assistant capabilities
        if (
            q.includes("what can you help me with") ||
            q.includes("what can you do") ||
            q.includes("help me") ||
            q.includes("your features") ||
            q.includes("capabilities")
        ) {
            return res.json({
                success: true,
                answer:
                    "Hospital AI Assistant Features:\n\n" +
                    "1. Doctors list and count.\n" +
                    "2. Patients list and count.\n" +
                    "3. Total appointments.\n" +
                    "4. Appointment status summary.\n" +
                    "5. Today's appointments.\n" +
                    "6. All appointment details.\n" +
                    "7. Search appointment by ID.\n" +
                    "8. Search appointments by status.\n" +
                    "9. Hospital summary.\n\n" +
                    "Try asking:\n" +
                    "- Show appointment ID 4.\n" +
                    "- Find appointment 3.\n" +
                    "- Show all pending appointments.\n" +
                    "- Show all approved appointments.\n" +
                    "- Show today's appointments.\n" +
                    "- Give me a hospital summary.",
                source: "database"
            });
        }

        // Hospital summary
        if (
            q.includes("hospital summary") ||
            q.includes("summary of hospital") ||
            q.includes("overall summary") ||
            q.includes("hospital overview") ||
            q.includes("summarize hospital")
        ) {
            return res.json({
                success: true,
                answer:
                    "Hospital Summary:\n\n" +
                    "Total Doctors: " + doctors.length + "\n" +
                    "Total Patients: " + patients.length + "\n" +
                    "Total Appointments: " + appointments.length + "\n\n" +
                    "Appointment Status:\n" +
                    "Pending: " + statusCounts.pending + "\n" +
                    "Approved: " + statusCounts.approved + "\n" +
                    "Completed: " + statusCounts.completed + "\n" +
                    "Cancelled: " + statusCounts.cancelled,
                source: "database"
            });
        }

        // Search appointment by ID
        const appointmentIdMatch = q.match(
            /\b(?:appointment|booking)\s*(?:id\s*)?#?\s*(\d+)\b|\b(?:id|number)\s*#?\s*(\d+)\b/
        );

        const asksForSpecificAppointment =
            appointmentIdMatch &&
            (
                q.includes("appointment") ||
                q.includes("booking")
            );

        if (asksForSpecificAppointment) {
            const requestedId = Number(
                appointmentIdMatch[1] || appointmentIdMatch[2]
            );

            const foundAppointment = appointments.filter(function (a) {
                return Number(a.id) === requestedId;
            });

            return res.json({
                success: true,
                answer: getAppointmentDetails(foundAppointment),
                source: "database"
            });
        }

        // All appointment details
        if (
            q.includes("show me all appointment") ||
            q.includes("show all appointment") ||
            q.includes("all appointments") ||
            q.includes("appointment details") ||
            q.includes("all booking details")
        ) {
            return res.json({
                success: true,
                answer: getAppointmentDetails(appointments),
                source: "database"
            });
        }

        // Search appointments by status
        const requestedStatus =
            ["pending", "approved", "completed"].find(function (status) {
                return q.includes(status);
            }) ||
            (
                q.includes("cancelled") || q.includes("canceled")
                    ? "cancelled"
                    : null
            );

        if (
            requestedStatus &&
            (
                q.includes("appointment") ||
                q.includes("booking")
            )
        ) {
            const filteredAppointments = appointments.filter(function (a) {
                const actualStatus = String(a.status || "").toLowerCase();

                if (requestedStatus === "cancelled") {
                    return actualStatus === "cancelled" ||
                        actualStatus === "canceled";
                }

                return actualStatus === requestedStatus;
            });

            return res.json({
                success: true,
                answer:
                    "Appointments with status: " + requestedStatus + "\n\n" +
                    getAppointmentDetails(filteredAppointments),
                source: "database"
            });
        }

        // Today's appointments
        const asksAboutToday =
            q.includes("today") ||
            q.includes("aaj") ||
            q.includes("aj ");

        if (
            asksAboutToday &&
            (
                q.includes("appointment") ||
                q.includes("booking") ||
                q.includes("schedule") ||
                q.includes("time")
            )
        ) {
            return res.json({
                success: true,
                answer:
                    "Today's date: " + today + "\n\n" +
                    getAppointmentDetails(todaysAppointments),
                source: "database"
            });
        }

        // Doctors list and count
        if (q.includes("doctor")) {
            if (doctors.length === 0) {
                return res.json({
                    success: true,
                    answer: "There are currently no doctors in the hospital.",
                    source: "database"
                });
            }

            let answer =
                "Total doctors in the hospital: " +
                doctors.length + "\n\nDoctors list:\n";

            doctors.forEach(function (d, index) {
                answer +=
                    (index + 1) + ". " +
                    (d.name || "Name unavailable") + " - " +
                    (d.specialization || "Specialization unavailable") + "\n";
            });

            return res.json({
                success: true,
                answer: answer,
                source: "database"
            });
        }

        // Patients list and count
        if (q.includes("patient")) {
            if (
                q.includes("list") ||
                q.includes("show") ||
                q.includes("names")
            ) {
                if (patients.length === 0) {
                    return res.json({
                        success: true,
                        answer: "There are currently no patients in the hospital.",
                        source: "database"
                    });
                }

                let answer =
                    "Total patients: " + patients.length + "\n\nPatients list:\n";

                patients.forEach(function (p, index) {
                    answer +=
                        (index + 1) + ". " +
                        (p.name || "Name unavailable") + "\n";
                });

                return res.json({
                    success: true,
                    answer: answer,
                    source: "database"
                });
            }

            return res.json({
                success: true,
                answer:
                    "Total patients in the hospital: " + patients.length,
                source: "database"
            });
        }

        // Appointment status summary
        if (
            q.includes("pending") ||
            q.includes("approved") ||
            q.includes("completed") ||
            q.includes("cancelled") ||
            q.includes("canceled") ||
            q.includes("status")
        ) {
            return res.json({
                success: true,
                answer:
                    "Appointment Status Summary:\n\n" +
                    "Pending: " + statusCounts.pending + "\n" +
                    "Approved: " + statusCounts.approved + "\n" +
                    "Completed: " + statusCounts.completed + "\n" +
                    "Cancelled: " + statusCounts.cancelled + "\n" +
                    "Total appointments: " + appointments.length,
                source: "database"
            });
        }

        // Total appointments
        if (
            q.includes("appointment") ||
            q.includes("booking")
        ) {
            return res.json({
                success: true,
                answer:
                    "Your hospital currently has " +
                    appointments.length + " appointments.",
                source: "database"
            });
        }

        // Hospital data for Gemini
        const hospitalData = {
            totalDoctors: doctors.length,
            doctors: doctors.map(function (d) {
                return d.toJSON();
            }),
            totalPatients: patients.length,
            patients: patients.map(function (p) {
                return p.toJSON();
            }),
            totalAppointments: appointments.length,
            appointments: appointments.map(function (a) {
                return a.toJSON();
            }),
            appointmentStatusCounts: statusCounts
        };

        const fallbackAnswer =
            "Hospital Summary:\n\n" +
            "Doctors: " + doctors.length + "\n" +
            "Patients: " + patients.length + "\n" +
            "Appointments: " + appointments.length + "\n\n" +
            "Appointment Statuses:\n" +
            "Pending: " + statusCounts.pending + "\n" +
            "Approved: " + statusCounts.approved + "\n" +
            "Completed: " + statusCounts.completed + "\n" +
            "Cancelled: " + statusCounts.cancelled;

        // Gemini AI for other questions
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const response = await ai.models.generateContent({
                    model: "gemini-3.8-flash",
                    contents:
                        "You are a helpful Hospital Management System AI Assistant.\n" +
                        "Use only the supplied hospital data. Never invent facts.\n" +
                        "Do not reveal passwords, API keys, tokens, or sensitive information.\n\n" +
                        "Hospital data:\n" +
                        JSON.stringify(hospitalData, null, 2) +
                        "\n\nUser question:\n" + question
                });

                if (response.text) {
                    return res.json({
                        success: true,
                        answer: response.text,
                        source: "gemini"
                    });
                }

                break;
            } catch (error) {
                console.error(
                    "Gemini attempt " + attempt + " failed:",
                    error.message
                );

                const temporaryError =
                    error.status === 503 ||
                    error.status === 429 ||
                    error.status === 500 ||
                    error.status === 502 ||
                    error.status === 504 ||
                    /high demand|unavailable|overloaded|503|429/i.test(
                        error.message || ""
                    );

                if (!temporaryError || attempt === 3) {
                    break;
                }

                await sleep(attempt * 1000);
            }
        }

        return res.json({
            success: true,
            answer:
                fallbackAnswer +
                "\n\n(Gemini AI is temporarily unavailable. " +
                "This answer uses hospital database records.)",
            source: "database"
        });

    } catch (error) {
        console.error("AI Assistant Error:", error);

        return res.status(500).json({
            success: false,
            message: "AI Assistant request failed."
        });
    }
};

module.exports = aiAssistant;
