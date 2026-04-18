import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from 'react-hot-toast';
import Courses from "./components/COurses";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourse from "./admin/OurCourse";
import Dashboared from "./admin/Dashboard";
import { Navigate } from "react-router-dom";

function App() {

  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));
  return( <div>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Other Routes */}
       <Route path="/courses" element={<Courses />} />
       <Route path="/buy/:courseId" element={<Buy/>} />
       <Route path="/purchases" element={user?<Purchases /> :<Navigate to={"/login"}/>} />

       {/* Admin Routes */}
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboared" element={admin?<Dashboared />:<Navigate to={"/admin/login"}/>} />
      <Route path="/admin/create-course" element={<CourseCreate/>} />
      <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
      <Route path="/admin/our-courses" element={<OurCourse/>}/>


      

      </Routes>
      <Toaster/>
  </div>
  );
}

export default App;