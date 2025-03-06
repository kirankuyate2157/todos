import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { FaPlus } from "react-icons/fa";
import { FaAnglesUp, FaUserGroup } from "react-icons/fa6";
import { FiInfo } from "react-icons/fi";
import { IoMdDoneAll } from "react-icons/io";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { PiTagFill } from "react-icons/pi";
import { ROUTES } from "@/constants/ROUTES";
import { useEffect, useState } from "react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabs, setTab] = useState("home");
  const handleCreateTask = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("createTask", "true");
    navigate({ search: searchParams.toString() });
  };
  useEffect(() => {
    setTab(`${Math.random()}`);
  }, [location]);
  return (
    <div className=''>
      <aside
        id='sidebar'
        className=' z-40 h-[95vh]  w-0 sm:w-full max-w-48  sm:block transition-transform'
        aria-label='Sidebar'
      >
        <div className=' h-full flex-col hidden sm:flex overflow-y-auto border-r border-slate-200 bg-background px-3 py-4 dark:border-slate-700 '>
          <Button onClick={handleCreateTask}>
            <FaPlus />
            <span>New Task</span>
          </Button>
          <ul className='space-y-2 mt-2 text-sm font-medium'>
            <li>
              <Link
                to={ROUTES.Important.route}
                className='flex items-center rounded  px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'
              >
                <FiInfo className='text-xl' />

                <span className='ml-3 overflow-x-hidden  whitespace-nowrap'>
                  Important
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.Completed.route}
                className='flex items-start rounded border-t px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'
              >
                <IoMdDoneAll className='text-xl' />
                <span className='ml-3 overflow-x-hidden  whitespace-nowrap'>
                  Completed
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.DueSoon.route}
                className='flex items-center rounded border-t px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'
              >
                <HiOutlineDotsHorizontal className='text-xl' />
                <span className='ml-3 overflow-x-hidden  whitespace-nowrap'>
                  Due Soon
                </span>
              </Link>
            </li>
            <li>
              <div className='flex flex-col items-start rounded px-3 border-t text-slate-900 dark:text-white '>
                <div className='flex items-center rounded  py-2 w-full text-slate-900  dark:text-white '>
                  <FaAnglesUp className='text-xl' />
                  <span className='ml-3 overflow-x-hidden  whitespace-nowrap'>
                    Priority
                  </span>
                </div>
                <li>
                  <ul className='space-y-1 pl-6'>
                    <li className='w-full rounded border-t text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
                      <Link to={ROUTES.HighPriority.route}>🔴 High</Link>
                    </li>
                    <li className='w-full rounded border-t text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
                      <Link to={ROUTES.MediumPriority.route}>🟠 Medium</Link>
                    </li>
                    <li className='w-full rounded border-t text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'>
                      <Link to={ROUTES.LowPriority.route}>🟢 Low</Link>
                    </li>
                  </ul>
                </li>
              </div>
            </li>

            <li>
              <Link
                to={"/notification"}
                className='flex items-center rounded border-t px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'
              >
                <PiTagFill className='text-xl' />
                <span className='ml-3 overflow-x-hidden  whitespace-nowrap'>
                  Notification
                </span>
              </Link>
            </li>
            <li>
              <Link
                to={"/users"}
                className='flex items-center rounded border-t px-3 py-2 text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700'
              >
                <FaUserGroup className='text-xl' />
                <span className='ml-3 overflow-x-hidden  whitespace-nowrap'>
                  Users
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
