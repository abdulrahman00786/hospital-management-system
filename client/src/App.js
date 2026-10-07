import { BrowserRouter, Routes, Route } from "react-router-dom";


import Navbar from "./components/navbar";

import ProtectedRoute from "./components/ProtectedRoute";


import Dashboard from "./pages/dashboard";

import Doctor from "./pages/doctor";

import Patient from "./pages/patient";

import Appointment from "./pages/appointment";

import Prescriptions from "./pages/Prescriptions";

import Billing from "./pages/billing";

import Login from "./pages/login";

import Register from "./pages/register";






function App(){


return(


<BrowserRouter>



<Navbar />




<div

style={{

marginLeft:"250px",

padding:"20px"

}}

>




<Routes>





<Route

path="/"

element={

<ProtectedRoute>

<Dashboard />

</ProtectedRoute>

}

/>






<Route

path="/doctors"

element={

<ProtectedRoute>

<Doctor />

</ProtectedRoute>

}

/>






<Route

path="/patients"

element={

<ProtectedRoute>

<Patient />

</ProtectedRoute>

}

/>






<Route

path="/appointments"

element={

<ProtectedRoute>

<Appointment />

</ProtectedRoute>

}

/>






<Route

path="/prescriptions"

element={

<ProtectedRoute>

<Prescriptions />

</ProtectedRoute>

}

/>






<Route

path="/billing"

element={

<ProtectedRoute>

<Billing />

</ProtectedRoute>

}

/>








<Route

path="/login"

element={<Login />}

/>







<Route

path="/register"

element={<Register />}

/>





</Routes>



</div>





</BrowserRouter>


);


}



export default App;