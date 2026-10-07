const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");


const Appointment = sequelize.define(

    "Appointment",

    {

        id:{
            type: DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },


        patientId:{
            type: DataTypes.INTEGER,
            allowNull:false
        },


        doctorId:{
            type: DataTypes.INTEGER,
            allowNull:false
        },


        appointmentDate:{
            type: DataTypes.DATEONLY,
            allowNull:false
        },


        appointmentTime:{
            type: DataTypes.STRING,
            allowNull:false
        },


        status:{
            type: DataTypes.ENUM(
                "pending",
                "approved",
                "completed",
                "cancelled"
            ),
            defaultValue:"pending"
        }


    },


    {
        tableName:"appointments",
        timestamps:true
    }

);


module.exports = Appointment;