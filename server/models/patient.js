const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");


const Patient = sequelize.define(

"Patient",

{

id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
},


name:{
    type:DataTypes.STRING,
    allowNull:false
},


email:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true
},


phone:{
    type:DataTypes.STRING,
    allowNull:false
},


age:{
    type:DataTypes.INTEGER,
    allowNull:false
},


gender:{
    type:DataTypes.ENUM(
        "Male",
        "Female",
        "Other"
    ),
    allowNull:false
},


address:{
    type:DataTypes.STRING,
    allowNull:false
}

},

{
    tableName:"patients",
    timestamps:true
}

);


module.exports = Patient;