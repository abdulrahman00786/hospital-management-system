const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const Doctor = sequelize.define(
    "Doctor",
    {

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },

        specialization: {
            type: DataTypes.STRING,
            allowNull: false
        },

        experience: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        image: {
            type: DataTypes.STRING,
            allowNull: true
        }

    },
    {
        tableName: "doctors",
        timestamps: true
    }
);

module.exports = Doctor;