require("dotenv").config();

const sequelize = require("./database/connection");

async function fixDate() {
    try {
        const [result] = await sequelize.query(
            `UPDATE appointments
             SET "appointmentDate" = '2026-10-15'
             WHERE id = 1`
        );

        console.log("Appointment date updated successfully!");
        console.log(result);
    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await sequelize.close();
    }
}

fixDate();