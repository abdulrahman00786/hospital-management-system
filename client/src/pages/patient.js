import { useEffect, useState } from "react";
import axios from "axios";


function Patient(){


const [patients,setPatients] = useState([]);



const [patient,setPatient] = useState({

name:"",
email:"",
phone:"",
age:"",
gender:"",
address:""

});



const [editId,setEditId] = useState(null);






const getPatients = async()=>{


try{


const response = await axios.get(

"http://localhost:5000/api/patients"

);



setPatients(response.data.data);



}catch(error){

console.log(error);

}


};





useEffect(()=>{

getPatients();

},[]);











const handleChange=(e)=>{


setPatient({

...patient,

[e.target.name]:e.target.value

});


};











const savePatient = async(e)=>{


e.preventDefault();



try{



if(editId){



await axios.put(

`http://localhost:5000/api/patients/${editId}`,

{

...patient,

age:Number(patient.age)

}

);



alert("Patient Updated Successfully");



setEditId(null);



}

else{



await axios.post(

"http://localhost:5000/api/patients",

{

...patient,

age:Number(patient.age)

}

);



alert("Patient Added Successfully");



}




setPatient({

name:"",
email:"",
phone:"",
age:"",
gender:"",
address:""

});



getPatients();



}
catch(error){


console.log(error);


alert("Operation Failed");


}



};










const editPatient=(p)=>{


setEditId(p.id);



setPatient({

name:p.name,

email:p.email,

phone:p.phone,

age:p.age,

gender:p.gender,

address:p.address

});


};












const deletePatient=async(id)=>{


try{


await axios.delete(

`http://localhost:5000/api/patients/${id}`

);



alert("Patient Deleted Successfully");


getPatients();



}
catch(error){


console.log(error);


alert("Delete Failed");


}



};









return(


<div className="container mt-4">


<h2>
🧑 Patient Management
</h2>


<hr/>





<form onSubmit={savePatient}>


<input

className="form-control mb-2"

name="name"

placeholder="Patient Name"

value={patient.name}

onChange={handleChange}

/>





<input

className="form-control mb-2"

name="email"

placeholder="Email"

value={patient.email}

onChange={handleChange}

/>





<input

className="form-control mb-2"

name="phone"

placeholder="Phone"

value={patient.phone}

onChange={handleChange}

/>





<input

className="form-control mb-2"

name="age"

placeholder="Age"

value={patient.age}

onChange={handleChange}

/>





<select

className="form-control mb-2"

name="gender"

value={patient.gender}

onChange={handleChange}

>


<option value="">
Select Gender
</option>


<option value="Male">
Male
</option>


<option value="Female">
Female
</option>


<option value="Other">
Other
</option>


</select>





<input

className="form-control mb-2"

name="address"

placeholder="Address"

value={patient.address}

onChange={handleChange}

/>





<button className="btn btn-primary">


{

editId

?

"Update Patient"

:

"Add Patient"

}


</button>



</form>







<hr/>


<h3>
Patient List
</h3>






<table className="table table-bordered">


<thead className="table-dark">


<tr>


<th>Name</th>

<th>Email</th>

<th>Phone</th>

<th>Age</th>

<th>Gender</th>

<th>Address</th>

<th>Action</th>


</tr>


</thead>





<tbody>


{

patients.map((p)=>(


<tr key={p.id}>


<td>{p.name}</td>


<td>{p.email}</td>


<td>{p.phone}</td>


<td>{p.age}</td>


<td>{p.gender}</td>


<td>{p.address}</td>



<td>


<button

className="btn btn-warning me-2"

onClick={()=>editPatient(p)}

>

Edit

</button>





<button

className="btn btn-danger"

onClick={()=>deletePatient(p.id)}

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



export default Patient;