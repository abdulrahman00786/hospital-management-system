import { useEffect, useState } from "react";
import axios from "axios";


function Doctor(){


const [doctors,setDoctors] = useState([]);


const [doctor,setDoctor] = useState({

name:"",
email:"",
phone:"",
specialization:"",
experience:""

});


const [editId,setEditId] = useState(null);







const getDoctors = async()=>{


try{


const response = await axios.get(
"http://localhost:5000/api/doctors"
);



setDoctors(response.data.data);



}catch(error){

console.log(error);

}


};




useEffect(()=>{

getDoctors();

},[]);









const handleChange=(e)=>{


setDoctor({

...doctor,

[e.target.name]:e.target.value

});


};











const saveDoctor = async(e)=>{


e.preventDefault();



try{



if(editId){



await axios.put(

`http://localhost:5000/api/doctors/${editId}`,

{

...doctor,

experience:Number(doctor.experience)

}

);



alert("Doctor Updated Successfully");



setEditId(null);



}

else{



await axios.post(

"http://localhost:5000/api/doctors",

{

...doctor,

experience:Number(doctor.experience)

}

);



alert("Doctor Added Successfully");


}





setDoctor({

name:"",
email:"",
phone:"",
specialization:"",
experience:""

});



getDoctors();



}
catch(error){


console.log(error);


alert("Operation Failed");


}



};












const editDoctor=(doc)=>{


setEditId(doc.id);



setDoctor({

name:doc.name,

email:doc.email,

phone:doc.phone,

specialization:doc.specialization,

experience:doc.experience

});


};










const deleteDoctor=async(id)=>{


try{


await axios.delete(

`http://localhost:5000/api/doctors/${id}`

);



alert("Doctor Deleted Successfully");


getDoctors();



}
catch(error){


console.log(error);


alert("Delete Failed");


}



};







return(


<div className="container mt-4">


<h2>
👨‍⚕️ Doctor Management
</h2>


<hr/>





<form onSubmit={saveDoctor}>


<input

className="form-control mb-2"

name="name"

placeholder="Doctor Name"

value={doctor.name}

onChange={handleChange}

/>




<input

className="form-control mb-2"

name="email"

placeholder="Email"

value={doctor.email}

onChange={handleChange}

/>




<input

className="form-control mb-2"

name="phone"

placeholder="Phone"

value={doctor.phone}

onChange={handleChange}

/>




<input

className="form-control mb-2"

name="specialization"

placeholder="Specialization"

value={doctor.specialization}

onChange={handleChange}

/>




<input

className="form-control mb-2"

name="experience"

placeholder="Experience"

value={doctor.experience}

onChange={handleChange}

/>




<button className="btn btn-primary">


{

editId

?

"Update Doctor"

:

"Add Doctor"

}


</button>



</form>






<hr/>


<h3>Doctor List</h3>





<table className="table table-bordered">


<thead className="table-dark">


<tr>

<th>Name</th>

<th>Email</th>

<th>Phone</th>

<th>Specialization</th>

<th>Experience</th>

<th>Action</th>


</tr>


</thead>




<tbody>


{

doctors.map((doc)=>(


<tr key={doc.id}>


<td>{doc.name}</td>

<td>{doc.email}</td>

<td>{doc.phone}</td>

<td>{doc.specialization}</td>

<td>{doc.experience}</td>



<td>


<button

className="btn btn-warning me-2"

onClick={()=>editDoctor(doc)}

>

Edit

</button>




<button

className="btn btn-danger"

onClick={()=>deleteDoctor(doc.id)}

>

Delete

</button>



</td>



</tr>



))


}


</tbody>



</table>





</div>


);


}



export default Doctor;