import { useEffect, useState } from "react";
import axios from "axios";


function Dashboard(){


const [data,setData]=useState({

doctors:0,
patients:0,
appointments:0,
revenue:0,

recentPatients:[],
recentAppointments:[],
recentBills:[]

});





const getDashboard=async()=>{


try{


const response = await axios.get(

"http://localhost:5000/api/dashboard"

);



setData(response.data.data);



}
catch(error){

console.log(error);

}


};





useEffect(()=>{


getDashboard();


},[]);







return(


<div className="container mt-4">



<div className="card shadow p-4 bg-primary text-white mb-4">


<h1>
🏥 Hospital Management Dashboard
</h1>


<p>
Complete Hospital Overview
</p>


</div>






<div className="row">



<div className="col-md-3">

<div className="card shadow text-center p-3 mb-3">


<h2>👨‍⚕️</h2>

<h5>Doctors</h5>

<h2>{data.doctors}</h2>


</div>

</div>






<div className="col-md-3">

<div className="card shadow text-center p-3 mb-3">


<h2>🧑</h2>

<h5>Patients</h5>

<h2>{data.patients}</h2>


</div>

</div>







<div className="col-md-3">

<div className="card shadow text-center p-3 mb-3">


<h2>📅</h2>

<h5>Appointments</h5>

<h2>{data.appointments}</h2>


</div>

</div>








<div className="col-md-3">

<div className="card shadow text-center p-3 mb-3">


<h2>💰</h2>

<h5>Revenue</h5>

<h2>Rs {data.revenue}</h2>


</div>

</div>




</div>








<hr/>

<h3>
🧑 Recent Patients
</h3>


<table className="table table-bordered">


<thead className="table-dark">

<tr>

<th>Name</th>
<th>Email</th>
<th>Phone</th>

</tr>

</thead>


<tbody>


{

data.recentPatients.map((p)=>(


<tr key={p.id}>

<td>{p.name}</td>

<td>{p.email}</td>

<td>{p.phone}</td>


</tr>


))


}


</tbody>


</table>









<hr/>

<h3>
📅 Recent Appointments
</h3>


<table className="table table-bordered">


<thead className="table-dark">


<tr>

<th>Patient ID</th>
<th>Doctor ID</th>
<th>Status</th>

</tr>


</thead>


<tbody>


{

data.recentAppointments.map((a)=>(


<tr key={a.id}>


<td>{a.patientId}</td>

<td>{a.doctorId}</td>

<td>{a.status}</td>


</tr>


))


}


</tbody>


</table>









<hr/>

<h3>
💰 Recent Billing
</h3>


<table className="table table-bordered">


<thead className="table-dark">


<tr>

<th>Patient ID</th>

<th>Amount</th>

<th>Status</th>


</tr>


</thead>



<tbody>



{

data.recentBills.map((b)=>(


<tr key={b.id}>


<td>{b.patientId}</td>

<td>Rs {b.amount}</td>

<td>{b.status}</td>


</tr>


))


}



</tbody>


</table>






</div>


);


}


export default Dashboard;