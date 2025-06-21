import React from "react";
// import RegistrationForm from "../RegistrationForm/RegistrationForm";
import { Route,Routes, BrowserRouter } from "react-router-dom";
import RegistrationForm from "../RegistrationForm/RegistrationForm";

function Login (){

    return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
      
      </Routes>
      <div>
        <form action="">
                <h4>Login</h4>
                 <label htmlFor="email">Email</label>
                 <input type="text" name="email" id="email" />
                 <label htmlFor="password">Password</label>
                 <input type="text" name="pswd" id="pswd"/>
                 <button>Submit</button>
        </form>
        </div>
    </BrowserRouter>

    )
}

export default Login;


