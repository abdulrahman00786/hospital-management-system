const Billing = require("../models/Billing");




const addBilling = async(req,res)=>{

try{


const billing = await Billing.create(req.body);


res.status(201).json({

success:true,

message:"Billing Added Successfully",

data:billing

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};






const getBillings = async(req,res)=>{


try{


const billings = await Billing.findAll();


res.json({

success:true,

data:billings

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};







const deleteBilling = async(req,res)=>{


try{


const billing = await Billing.findByPk(req.params.id);


if(!billing){

return res.status(404).json({

success:false,

message:"Billing Not Found"

});

}



await billing.destroy();



res.json({

success:true,

message:"Billing Deleted Successfully"

});


}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}


};




module.exports={

addBilling,

getBillings,

deleteBilling

};