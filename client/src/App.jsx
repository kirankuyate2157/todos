import { Route, Routes } from "react-router-dom";
import "./App.css";
import axios from "axios";
import Auth from "./components/Auth";
import HomeLayout from "./layouts/HomeLayout";
import { Toaster } from "react-hot-toast";
import { ROUTES as CUSTOM_ROUTES } from "./constants/ROUTES.js";
import Todo from "./components/Todo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./Store/user/userSlice";
import { currentUser } from "./components/Auth/utils/authApi";

function App() {
  axios.defaults.baseURL = "http://localhost:8080/api/v1";
  axios.defaults.params = {};
  axios.defaults.withCredentials = true;
  axios.defaults.headers.post["Content-Type"] = "application/json";

  const dispatch = useDispatch();
  useEffect(() => {
    const fetchLoginUser = async () => {
      try {
        const res = await currentUser();
        if (res) {
          console.log("cur usr :", res);
          dispatch(login(res));
        }
      } catch (e) {
        console.log(e);
      }
    };
    fetchLoginUser();
  }, []);

  return (
    <div className='App  flex justify-center w-full bg-amber-50'>
      <Toaster position='top-right' />
      <div className='max-w-screen-2xl shadow-md rounded w-full'>
        <Routes>
          <Route path={CUSTOM_ROUTES.Auth.route} element={<Auth />} />
          <Route path={CUSTOM_ROUTES.Home.route} element={<HomeLayout />}>
            <Route path={CUSTOM_ROUTES.Home.route} element={<Todo />} />
            <Route
              path={CUSTOM_ROUTES.Important.route}
              element={<>Important</>}
            />
            <Route
              path={CUSTOM_ROUTES.Completed.route}
              element={<>Completed</>}
            />
            <Route path={CUSTOM_ROUTES.DueSoon.route} element={<>DueSoon</>} />{" "}
            <Route
              path={CUSTOM_ROUTES.HighPriority.route}
              element={<>HighPriority</>}
            />
            <Route
              path={CUSTOM_ROUTES.MediumPriority.route}
              element={<>MediumPriority</>}
            />
            <Route
              path={CUSTOM_ROUTES.LowPriority.route}
              element={<>LowPriority</>}
            />
            <Route
              path={CUSTOM_ROUTES.Notification.route}
              element={<>Notification</>}
            />
            <Route path={CUSTOM_ROUTES.Users.route} element={<>Users</>} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
