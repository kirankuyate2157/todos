import React, { useState, useRef, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { Menu } from "lucide-react";
import { Input } from "./ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { FaAnglesUp, FaUserGroup } from "react-icons/fa6";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { FiInfo } from "react-icons/fi";
import { IoMdDoneAll } from "react-icons/io";
import {
  HiOutlineDocumentDownload,
  HiOutlineDotsHorizontal,
} from "react-icons/hi";
import { PiTagFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { currentUser, logOutUser } from "./Auth/utils/authApi";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { ROUTES } from "@/constants/ROUTES";
import { getTodos } from "./Todo/apis/todoAPI";
import { CSVLink } from "react-csv";

const MainNavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("important");
  const [isUserOpen, setIsUserOpen] = useState(false);
  const menuRef = useRef(null);
  const userDRef = useRef(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };
  const handleClickOutsideOfUser = (event) => {
    if (userDRef.current && !userDRef.current.contains(event.target)) {
      setIsUserOpen(false);
    }
  };

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await currentUser();
        if (res) {
          console.log(res);
          setUser(res);
        }
      } catch (error) {
        toast.error(error?.message || error);
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    if (isUserOpen) {
      document.addEventListener("mousedown", handleClickOutsideOfUser);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideOfUser);
    }
    return () =>
      document.removeEventListener("mousedown", handleClickOutsideOfUser);
  }, [isUserOpen]);

  const handleCommandClick = (tab, path) => {
    // console.log("nav..>> ", tab, path);
    setActiveTab(tab);
    navigate(path);
    setMenuOpen(false);
  };
  const [todoData, setTodoData] = useState([]);
  const [isPreparingCsv, setIsPreparingCsv] = useState(false);
  const csvLinkRef = useRef(null);

  const fetchAndDownloadCsv = async () => {
    if (isPreparingCsv) return;
    const toastId = toast.loading("Fetching todo data...");
    setIsPreparingCsv(true);

    try {
      const todos = await getTodos({ limit: 1000, all: false });
      const formattedData = todos?.data?.todos?.map((todo) => ({
        ID: todo?._id,
        Title: todo?.title,
        Description: todo?.description,
        Priority: todo?.priority,
        Status: todo?.isCompleted ? "Completed" : "Pending",
        "Mentioned Users": todo?.mentionedUsers
          ?.map((user) => user?.fullName || user?.username)
          .join(", "),
        Tags: todo?.tags?.map((tag) => tag?.name).join(", "),
        Created_Time: new Date(todo?.createdAt).toLocaleString()
      }));

      setTodoData(formattedData);
      toast.success("Todo data ready. Downloading...");
      setTimeout(() => {
        csvLinkRef.current.link.click();
      }, 500);
    } catch (error) {
      console.error("Failed to fetch todo data:", error);
      toast.error("Failed to fetch todo data.");
    } finally {
      toast.dismiss(toastId);
      setIsPreparingCsv(false);
    }
  };
  return (
    <>
      <nav className='bg-muted-foreground/20  border-gray-200 dark:bg-gray-900'>
        <div className=' flex  flex-wrap items-center justify-between p-4'>
          <span className='self-center text-2xl font-semibold whitespace-nowrap dark:text-white'>
            Todo
          </span>

          {/* <div className='hidden lg:block w-[40%]'>
            <Input type='text' className='bg-amber-50' placeholder='Search..' />
          </div> */}

          <div className='flex  items-center justify-end'>
            <Button
            variant='outline'
              className=' px-3 bg-gray-200 border-2 flex gap-1 items-center '
              onClick={fetchAndDownloadCsv}
            >
              <HiOutlineDocumentDownload style={{ fontSize: "23px" }} />{" "}
              CSV
            </Button>
            <CSVLink
              className='d-none'
              data={todoData}
              filename={`todos_${new Date().toISOString().split("T")[0]}.csv`}
              ref={csvLinkRef}
            />
            <button
              className='lg:hidden p-2 rounded-md focus:outline-none focus:ring'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Menu className='w-6 h-6' />
            </button>
            <div
              className='flex items-center cursor-pointer ml-2'
              onClick={() => setIsUserOpen(!isUserOpen)}
            >
              <FaUser className='text-lg mx-2' />
              <p>{user?.username || "NA"}</p>
            </div>
          </div>
        </div>
      </nav>
      {isUserOpen && (
        <div
          ref={userDRef}
          className='absolute z-100 top-16 right-4  w-40 bg-white border rounded-lg shadow-md'
        >
          <Command className='rounded-lg'>
            <CommandList>
              <CommandItem>
                <Button
                  variant='outline'
                  onClick={() => {
                    logOutUser();
                    toast.success("logout successfully");
                    navigate("/auth");
                    setIsUserOpen(false);
                  }}
                  className='block w-full px-4 py-2 text-left text-sm '
                >
                  Logout
                </Button>{" "}
              </CommandItem>
            </CommandList>
          </Command>
        </div>
      )}
      {menuOpen && (
        <div
          ref={menuRef}
          className='absolute z-100 lg:hidden top-16 right-4 w-72 bg-white shadow-lg rounded-lg p-2 border'
        >
          <Command className='rounded-lg'>
            <CommandInput
              placeholder='Type a command or search...'
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>

              <CommandGroup heading='Tasks'>
                <CommandItem
                  onSelect={() =>
                    handleCommandClick("important", ROUTES.Important.route)
                  }
                  className={activeTab === "important" ? "bg-gray-200" : ""}
                >
                  <FiInfo />
                  <span>Important</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    handleCommandClick("completed", ROUTES.Completed.route)
                  }
                  className={activeTab === "completed" ? "bg-gray-200" : ""}
                >
                  <IoMdDoneAll />
                  <span>Completed</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    handleCommandClick("due", ROUTES.DueSoon.route)
                  }
                  className={activeTab === "due" ? "bg-gray-200" : ""}
                >
                  <HiOutlineDotsHorizontal />
                  <span>Due Soon</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading='Priority'>
                <CommandItem
                  onSelect={() =>
                    handleCommandClick("high", ROUTES.HighPriority.route)
                  }
                  className={activeTab === "high" ? "bg-gray-200" : ""}
                >
                  <FaAnglesUp />
                  <span>High</span>
                </CommandItem>
                <CommandItem
                  onClick={() =>
                    handleCommandClick("medium", ROUTES.MediumPriority.route)
                  }
                  className={activeTab === "medium" ? "bg-gray-200" : ""}
                >
                  <FaAnglesUp />
                  <span>Medium</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    handleCommandClick("low", ROUTES.LowPriority.route)
                  }
                  className={activeTab === "low" ? "bg-gray-200" : ""}
                >
                  <FaAnglesUp />
                  <span>Low</span>
                </CommandItem>
              </CommandGroup>

              <CommandSeparator />

              <CommandGroup heading='More'>
                <CommandItem
                  onSelect={() =>
                    handleCommandClick(
                      "notification",
                      ROUTES.Notification.route
                    )
                  }
                  className={activeTab === "notification" ? "bg-gray-200" : ""}
                >
                  <PiTagFill />
                  <span>Notification</span>
                </CommandItem>
                <CommandItem
                  onSelect={() =>
                    handleCommandClick("users", ROUTES.Users.route)
                  }
                  className={activeTab === "users" ? "bg-gray-200" : ""}
                >
                  <FaUserGroup />
                  <span>Users</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </>
  );
};

export default MainNavBar;
