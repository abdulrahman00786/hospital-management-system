import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Login(){


    const navigate = useNavigate();



    const [user,setUser] = useState({

        email:"",
        password:""

    });





    const handleChange = (e)=>{


        setUser({

            ...user,

            [e.target.name]:e.target.value

        });


    };








    const loginUser = async(e)=>{


        e.preventDefault();



        try{


            const response = await axios.post(

                "http://localhost:5000/api/users/login",

                user

            );





            console.log(response.data);





            localStorage.setItem(

                "token",

                response.data.token

            );





            localStorage.setItem(

                "user",

                JSON.stringify(response.data.user)

            );







            alert("Login Successfully");



            navigate("/");



            window.location.reload();



        }

        catch(error){



            console.log(error);



            alert(

                error.response?.data?.message ||

                "Login Failed"

            );


        }



    };









    return(


        <div className="container mt-5">


            <div className="card p-4 shadow">


                <h2 className="mb-3">

                    🔐 User Login

                </h2>




                <form onSubmit={loginUser}>


                    <input


                    className="form-control mb-3"


                    type="email"


                    name="email"


                    placeholder="Enter Email"


                    value={user.email}


                    onChange={handleChange}


                    required


                    />







                    <input


                    className="form-control mb-3"


                    type="password"


                    name="password"


                    placeholder="Enter Password"


                    value={user.password}


                    onChange={handleChange}


                    required


                    />







                    <button


                    className="btn btn-primary"


                    type="submit"


                    >

                        Login

                    </button>



                </form>


            </div>


        </div>


    );

}



export default Login;