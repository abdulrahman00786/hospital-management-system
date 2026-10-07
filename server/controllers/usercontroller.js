const User = require("../models/User");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");






const register = async(req,res)=>{


try{


const {

name,
email,
password,
role


}=req.body;




const existUser = await User.findOne({

where:{email}

});



if(existUser){


return res.status(400).json({

success:false,

message:"Email already exists"

});


}




const hashPassword = await bcrypt.hash(

password,

10

);




const user = await User.create({


name,

email,

password:hashPassword,

role


});





res.status(201).json({

success:true,

message:"User Registered Successfully",

data:user


});




}
catch(error){


res.status(500).json({

success:false,

message:error.message

});


}



};




const login = async(req,res)=>{


try{


const {

email,

password


}=req.body;




const user = await User.findOne({

where:{email}

});





if(!user){


return res.status(404).json({

success:false,

message:"User not found"

});


}





const matchPassword = await bcrypt.compare(

password,

user.password

);




if(!matchPassword){


return res.status(400).json({

success:false,

message:"Invalid Password"

});


}




const token = jwt.sign(

{

id:user.id,

role:user.role

},

process.env.JWT_SECRET,

{

expiresIn:"1d"

}

);





res.json({

success:true,

message:"Login Successfully",

token,

user

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

register,

login

};