require("dotenv").config();

const sequelize = require("./database/connection");

async function checkAppointments() {
    try {
        const [rows] = await sequelize.query(
            'SELECT id, "appointmentDate", "appointmentTime", status FROM appointments'
        );

        console.log("Appointments found:", rows.length);
        console.log(rows);
    } catch (error) {
        console.log("Database error:", error.message);
    } finally {
        await sequelize.close();
    }
}

checkAppointments();