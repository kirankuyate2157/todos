import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { FaUserCog } from "react-icons/fa";
const Auth = () => {
  const [type, setType] = useState("login");

  return (
    <div className='w-[100vw] bg-purple-50 flex justify-center'>
      <div className='w-full max-w-[1400px]  p-2 font-sans sm:p-6 lg:p-20 h-[100vh] flex flex-col justify-center '>
        <div className='w-full md:hidden text-slate-700 text-4xl font-serif font-bold p-3 flex justify-center text-center'>
          <h2 className='flex gap-3 '>
            Task Management <FaUserCog className='animate-pulse' />
          </h2>
        </div>
        <div className='w-full flex  flex-col md:flex-row bg-white border border-gray-300 rounded-md overflow-hidden'>
          <div className='w-full lg:w-1/2 hidden md:block lg:h-full relative '>
            <img
              src={"https://images.unsplash.com/photo-1658317937901-ac337cfe6377?q=80&w=2090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt=''
              className='pl-5   h-full'
            />
          </div>

          <div className='w-full lg:w-1/2 flex flex-col justify-center  p-5 sm:p-10'>
            {type === "signup" ? (
              <Signup setType={setType} />
            ) : (
              <Login setType={setType} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
