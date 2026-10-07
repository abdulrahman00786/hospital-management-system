import { useEffect, useState } from "react";
import axios from "axios";


function Billing(){


const [billings,setBillings] = useState([]);



const [billing,setBilling] = useState({

patientId:"",
doctorId:"",
amount:"",
paymentStatus:"Pending",
paymentMethod:"Cash"

});




// Get Billing

const getBillings = async()=>{


try{


const response = await axios.get(

"http://localhost:5000/api/billing"

);


setBillings(response.data.data);


}
catch(error){

console.log(error);

}


};





useEffect(()=>{


getBillings();


},[]);







// Input Handle

const handleChange=(e)=>{


setBilling({

...billing,

[e.target.name]:e.target.value


});


};








// Add Billing


const addBilling=async(e)=>{


e.preventDefault();



try{


await axios.post(

"http://localhost:5000/api/billing",

billing

);



alert("Billing Added Successfully");



setBilling({

patientId:"",
doctorId:"",
amount:"",
paymentStatus:"Pending",
paymentMethod:"Cash"

});



getBillings();



}
catch(error){


console.log(error);


alert("Billing Add Failed");


}



};









// Delete Billing


const deleteBilling=async(id)=>{


try{


await axios.delete(

`http://localhost:5000/api/billing/${id}`

);



alert("Billing Deleted Successfully");


getBillings();



}
catch(error){


console.log(error);


}



};








return(


<div className="container mt-4">


<h2>
💰 Billing Management
</h2>


<hr/>




<form onSubmit={addBilling}>


<input

className="form-control mb-2"

name="patientId"

placeholder="Patient ID"

value={billing.patientId}

onChange={handleChange}

/>





<input

className="form-control mb-2"

name="doctorId"

placeholder="Doctor ID"

value={billing.doctorId}

onChange={handleChange}

/>





<input

className="form-control mb-2"

name="amount"

placeholder="Amount"

value={billing.amount}

onChange={handleChange}

/>





<select

className="form-control mb-2"

name="paymentStatus"

value={billing.paymentStatus}

onChange={handleChange}

>


<option>
Pending
</option>


<option>
Paid
</option>


</select>





<select

className="form-control mb-2"

name="paymentMethod"

value={billing.paymentMethod}

onChange={handleChange}

>


<option>
Cash
</option>


<option>
Card
</option>


<option>
Online
</option>


</select>





<button className="btn btn-success">

Add Bill

</button>



</form>





<hr/>

<h3>
Billing List
</h3>





<table className="table table-bordered">


<thead className="table-dark">


<tr>

<th>ID</th>

<th>Patient ID</th>

<th>Doctor ID</th>

<th>Amount</th>

<th>Status</th>

<th>Method</th>

<th>Action</th>


</tr>


</thead>




<tbody>


{

billings.map((b)=>(


<tr key={b.id}>


<td>{b.id}</td>

<td>{b.patientId}</td>

<td>{b.doctorId}</td>

<td>{b.amount}</td>

<td>{b.paymentStatus}</td>

<td>{b.paymentMethod}</td>


<td>


<button

className="btn btn-danger"

onClick={()=>deleteBilling(b.id)}

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



export default Billing;