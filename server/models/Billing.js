const { DataTypes } = require("sequelize");

const sequelize = require("../database/connection");


const Billing = sequelize.define(

"Billing",

{

id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
},


patientId:{
    type:DataTypes.INTEGER,
    allowNull:false
},


doctorId:{
    type:DataTypes.INTEGER,
    allowNull:false
},


amount:{
    type:DataTypes.INTEGER,
    allowNull:false
},


paymentStatus:{
    type:DataTypes.ENUM(
        "Pending",
        "Paid"
    ),
    defaultValue:"Pending"
},


paymentMethod:{
    type:DataTypes.STRING,
    allowNull:false
}


},


{
    tableName:"billings",
    timestamps:true
}


);


module.exports = Billing;