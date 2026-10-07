const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");


const MedicalRecord = sequelize.define(

    "MedicalRecord",

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


        diagnosis:{
            type: DataTypes.STRING,
            allowNull:false
        },


        prescription:{
            type: DataTypes.STRING,
            allowNull:false
        },


        notes:{
            type: DataTypes.TEXT,
            allowNull:true
        }

    },


    {
        tableName:"medical_records",
        timestamps:true
    }

);


module.exports = MedicalRecord;