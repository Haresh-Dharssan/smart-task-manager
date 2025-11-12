import { useEffect, useState } from "react";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const { data } = await API.get("/tasks");
      setTasks(data);
    } catch (error) {
      console.error(error.response?.data?.message || "Error fetching tasks");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = storedUser?.token;

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; 

      if (decoded.exp < currentTime) {
        console.warn("Token expired");
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("user");
      navigate("/login");
      return;
    }

    fetchTasks();
  }, []);

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600 via-blue-500 to-cyan-400"></div>
      <nav className="bg-black/30 backdrop-blur-lg px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-md border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide text-center sm:text-left text-white">
          Smart Task Manager
        </h1>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full shadow-sm">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold uppercase">
              {JSON.parse(localStorage.getItem("user"))?.user?.name?.[0] ||
                  JSON.parse(localStorage.getItem("user"))?.name?.[0] ||
                  "U"}
            </div>
            <span className="text-sm font-medium text-white/90">
              {JSON.parse(localStorage.getItem("user"))?.user?.name ||  
                JSON.parse(localStorage.getItem("user"))?.name ||
                "User"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-4 py-2 text-sm font-semibold bg-red-500/90 hover:bg-red-500 rounded-lg text-white transition-colors duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      </nav>


      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md shadow-xl rounded-2xl mt-10 p-8">
        <h2 className="text-4xl text-white font-semibold text-center mb-8 font-serif">Dashboard</h2>

        <TaskForm onTaskAdded={fetchTasks} />

        <div className="mt-8">
          <TaskList tasks={tasks} onTaskChange={fetchTasks} />
        </div>
      </div>
    </div>
  );
}
