import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Register(){

    const navigate = useNavigate();


    const [user,setUser] = useState({

        name:"",
        email:"",
        password:"",
        role:"staff"

    });



    const handleChange=(e)=>{

        setUser({

            ...user,

            [e.target.name]:e.target.value

        });

    };





    const registerUser=async(e)=>{

        e.preventDefault();


        try{


            const response = await axios.post(

                "http://localhost:5000/api/users/register",

                user

            );


            alert(response.data.message);


            navigate("/login");


        }
        catch(error){


            console.log(error);


            alert(

                error.response?.data?.message ||

                "Registration Failed"

            );


        }


    };




    return(

        <div className="container mt-5">


            <h2>
                🏥 Create Account
            </h2>


            <hr/>


            <form onSubmit={registerUser}>


                <input

                className="form-control mb-3"

                name="name"

                placeholder="Full Name"

                value={user.name}

                onChange={handleChange}

                />





                <input

                className="form-control mb-3"

                name="email"

                placeholder="Email"

                value={user.email}

                onChange={handleChange}

                />





                <input

                className="form-control mb-3"

                type="password"

                name="password"

                placeholder="Password"

                value={user.password}

                onChange={handleChange}
                />


                <select

                className="form-control mb-3"

                name="role"

                value={user.role}

                onChange={handleChange}

                >


                    <option value="admin">
                        Admin
                    </option>


                    <option value="doctor">
                        Doctor
                    </option>


                    <option value="staff">
                        Staff
                    </option>


                </select>





                <button className="btn btn-success">

                    Register

                </button>



            </form>



        </div>

    );

}


export default Register;