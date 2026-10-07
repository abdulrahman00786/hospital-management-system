const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");


const Prescription = sequelize.define(

    "Prescription",

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


        medicineName:{
            type: DataTypes.STRING,
            allowNull:false
        },


        dosage:{
            type: DataTypes.STRING,
            allowNull:false
        },


        duration:{
            type: DataTypes.STRING,
            allowNull:false
        },


        instructions:{
            type: DataTypes.TEXT,
            allowNull:true
        }

    },


    {
        tableName:"prescriptions",
        timestamps:true
    }

);


module.exports = Prescription;