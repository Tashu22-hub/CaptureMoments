import React from 'react'
// create vite@latest  , cd to go into file , npm i react-router-dom 

import {BrowserRouter as Router , Routes , Route, Navigate } from "react-router-dom"

import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import Home from './pages/Home/home'


const App = ()  => {
 
  return (
      <div> 
        <Router>
          <Routes>
          <Route path = "/" exact element = {<Root/>} />
            <Route path = "/dashboard" exact element = {<Home/>} />
        
            <Route path = "/login" exact element = {<Login/>}/>
         
            <Route path = "/signup" exact element = {<Signup/>} />
          </Routes>
        </Router>
         </div>

  )
}
//defines the root components to handle the initial redirect
const Root =()=> {
  //check if token exists in localstorage 
  const isAuthenticate = !!localStorage.getItem("token");

  //redirect to dashboard if authenticate , otherwise to login
  return isAuthenticate?(
  <Navigate to = "/dashboard"/>
):( <Navigate to= "/login" />
);
};

export default App
