import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import toast from "react-hot-toast";
import { loginUser } from "./utils/authApi";

function Login({ setType }) {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const nav = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    if (Object.keys(data).length <= 0) {
      toast.error("please enter a valid credentials!");
      return;
    }
    try {
      const res = await loginUser(data);

      if (res) {
        toast.success("Login successfully");
        nav("/");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className='h-full  flex flex-col gap-3'>
      <div className='flex justify-end py-1'>
        <button
          onClick={() => setType("signup")}
          className='border p-1 px-3 border-slate-600 text-slate-600 rounded'
        >
          SIGN UP
        </button>
      </div>
      <div className='w-full h-full py-16   flex flex-col justify-center  gap-6'>
        <div className='text-slate-600 flex flex-col items-start justify-start'>
          <h1 className=' font-semibold text-[1.7rem] sm:text-3xl'>
            Efficient Task & Notes Management
          </h1>
          <p className='font-semibold text-sm'>
            Organize your tasks, track progress, and manage notes seamlessly!
          </p>
        </div>
        <div>
          <div className='flex flex-col items-start py-1.5 sm:py-3'>
            <input
              type='text'
              name='email'
              className='border-solid rounded-md border border-gray-300 w-[100%] p-2'
              placeholder='Email'
              onChange={handleChange}
              value={data.email}
              required
            />
          </div>

          <div className='flex flex-col items-start py-1.5 sm:py-3'>
            <div className='border-solid rounded-md border items-center border-gray-300 w-[100%] p-2 flex'>
              <input
                type={showPassword ? "text" : "password"}
                name='password'
                className='w-full outline-none'
                placeholder='Password'
                onChange={handleChange}
                value={data.password}
                required
              />
              {showPassword ? (
                <IoEyeOff onClick={() => setShowPassword(false)} />
              ) : (
                <IoEye onClick={() => setShowPassword(true)} />
              )}
            </div>
          </div>
        </div>
        <button
          type='submit'
          onClick={handleSubmit}
          className='w-full text-white font-semibold bg-slate-600 p-2 rounded-sm'
        >
          SIGN IN
        </button>
      </div>
    </div>
  );
}

export default Login;
