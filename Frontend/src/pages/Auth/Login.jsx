import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Add this import to use navigate
import PasswordInput from '../../components/Input/PasswordInput';
import {validateEmail} from "../../utils/helper"; // checking validEmail in input box
import axiosInstance from '../../utils/axiosInstance';
import nature3 from '../../assets/nature3.png'

const Login = () => {
  const navigate = useNavigate();  // Initialize the navigate function
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [error , setError] = useState(null);

  const handleLogin = async(e) =>{
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
    
    }
     if (!password) {
      setError("Please enter a required password");
      return;
    }
    
    setError("");
    //login API Call-install npm i axios
    try{
      const response = await axiosInstance.post("/login", { email, password });

      //handle successful login response
      if(response.data && response.data.accessToken){
        localStorage.setItem("token" , response.data.accessToken);
        navigate("/dashboard");
      }
    }catch(error){
      //handle login error
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
      

      }
    };
  return (
    <div className='h-screen bg-cyan-50 overflow-hidden relative'>
      <div className='login-ui-box right-10 -top-40'></div>
      <div className='login-ui-box bg-cyan-200 -bottom-40 right-1/2' ></div>
      <div className="container h-screen flex items-center justify-center px-20 mx-auto ">
        <div className="w-2/4 h-[90vh] flex items-end bg-login-bg-img bg-cover bg-center rounded-lg p-10 z-50">
        <img src={nature3} alt="Nature" />
          <div>
            <h4 className='text-white text-5xl font-semibold leading-[58px]'>Capture Your <br /> Journeys</h4>
            <p className="text-white text-[16px] leading-6 pr-7 mt-4"> 
              Record your travel experience and memories in your personal travel journal
            </p>
          </div>
        </div> 

        <div className='w-2/4 h-[75vh] bg-white rounded-r-lg relative p-16 shadow-lg shadow-cyan-200/2 '>
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl font-semibold mb-7">Login</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box mb-4 w-full p-3 border border-gray-300 rounded-lg outline-none"
              value={email}
              onChange={({target }) =>{
                setEmail(target.value);
              }}
            />
            <PasswordInput 
            value={password}
            onChange={({target }) =>{
              setPassword(target.value);
            }}
            />
            { error && <p className='text-red-500 text-xs pb-1'>{error}</p> }
            {/* <input
              type="password"
              placeholder="Password"
              className="input-box mb-4 w-full p-3 border border-gray-300 rounded-md"
            /> */}

            <button type="submit" className="btn-primary w-full p-3 bg-blue-400 text-white rounded-full hover:text-black hover:shadow-lg transition-all duration-300 shadow-blue-600">
              LOGIN
            </button>
            <p className="text-center my-4">Or</p>
            <button
              type="button"
              className="w-full p-3 bg-green-500 text-white rounded-full hover:text-black hover: shadow-lg  shadow-green-400"
              onClick={() => {
                navigate("/signup");
              }}
            >
              CREATE ACCOUNT
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
