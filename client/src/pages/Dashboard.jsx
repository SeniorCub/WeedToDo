import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTasks } from "react-icons/fa";
import { MdOutlineNoteAlt } from "react-icons/md";
import { BiBookmarkHeart, BiCalendar } from "react-icons/bi";
import axios from "axios";
import { logout } from "../hooks/logout";

const apiURL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
     const [user, setUser] = useState(null);
     const [isLoadingUser, setIsLoadingUser] = useState(true);

     useEffect(() => {
          const fetchData = async () => {
               setIsLoadingUser(true);

               const id = localStorage.getItem("id");
               const token = localStorage.getItem("token");

               if (!token) {
                    console.error("No authentication token found!");
                    setIsLoadingUser(false);
                    logout();
                    return;
               }

               const options = {
                    method: "GET",
                    url: `${apiURL}/user/${id}`,
                    headers: {
                         Accept: "*/*",
                         Authorization: `Bearer ${token}`,
                    },
               };

               try {
                    const response = await axios.request(options);
                    let user = response.data.data;
                    if (!user) {
                         console.error("User data not found!");
                         logout();
                    }
                    setUser(user);
               } catch (error) {
                    console.error("Error fetching user data:", error);
                    logout();
               } finally {
                    setIsLoadingUser(false);
               }
          };

          fetchData();
     }, []);

     const hour = new Date().getHours();
     const greeting = hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";


     return (
          <div className="bg-color1 text-white h-svh w-dvw overflow-hidden flex flex-col">
               <div className="basis-1/12 space-y-5 p-5 text-left">
                    <div className="flex justify-between items-center">
                         <div>
                              <h1 className="font-semibold text-2xl">Good {greeting},</h1>
                              <p className="font-normal text-lg flex gap-3">
                                   Dear{" "}
                                   {isLoadingUser ? (
                                        <span className="inline-block w-8 h-8 border-4 border-dotted border-t-transparent border-pry rounded-full animate-spin"></span>
                                   ) : (
                                        user?.fullname || "User"
                                   )}
                              </p>
                         </div>
                         <button type="button" className="avatar cursor-pointer focus:outline-none" onClick={()=> logout()}>
                              <div className="w-12 rounded-full">
                                   <img
                                        src={user?.photoUrl ?? "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                                        alt="User Profile"
                                        className="w-20 h-20 rounded-full object-cover"
                                   />
                              </div>
                         </button>
                    </div>
               </div>

               <div className="omo flex flex-col p-10 space-y-10 md:pt-28">
                    <Link to="/tasks" className="bg-color1 text-white w-full md:w-1/2 p-6 rounded-3xl text-xl flex justify-between items-center">
                         My Tasks <FaTasks />
                    </Link>
                    <Link to="/notes" className="bg-color1 md:mt-10 text-white w-full md:w-1/2 p-6 rounded-3xl text-xl flex justify-between items-center">
                         My Notes <MdOutlineNoteAlt />
                    </Link>
                    <Link to="/diary" className="bg-color1 text-white w-full md:w-1/2 p-6 rounded-3xl text-xl flex justify-between items-center">
                         My Diary <BiBookmarkHeart />
                    </Link>
                    <Link to="/calendar" className="bg-color1 text-white w-full md:w-1/2 p-6 rounded-3xl text-xl flex justify-between items-center">
                         My Calendar <BiCalendar />
                    </Link>
               </div>
          </div>
     );
};

export default Dashboard;
