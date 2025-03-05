import { Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Auth from "./components/Auth";
import HomeLayout from "./layouts/HomeLayout";
import { Toaster } from "react-hot-toast";

function App() {
  axios.defaults.baseURL = "http://localhost:8080/api/v1";
  axios.defaults.params = {};
  return (
    <div className='App  flex justify-center w-full bg-amber-50'>
      <Toaster position="top-right" />
      <div className='max-w-screen-2xl shadow-md rounded w-full'>

      <Routes>
        <Route path='/auth' element={<Auth />} />
        <Route path='/' element={<HomeLayout />}>
          <Route path='/' element={<>hhhh</>} />
        </Route>
      </Routes>
      </div>
    </div>
  );
}

export default App;
