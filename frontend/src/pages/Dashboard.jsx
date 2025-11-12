import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  const handleProfile = () => {
    navigate("/profile");
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
        localStorage.removeItem("user");
        navigate("/login");
        return;
      }
    } catch (err) {
      localStorage.removeItem("user");
      navigate("/login");
    }

    fetchTasks();
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
       document.removeEventListener("mousedown", handleClickOutside);
       document.removeEventListener("touchstart", handleClickOutside);
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const userName = user?.user?.name || user?.name || "User";

  return (
    <div className="relative min-h-screen text-white">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500"></div>

      {/* 🌟 NAVBAR */}
      <nav className="bg-black/30 backdrop-blur-lg px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-md border-b border-white/10 relative z-50">
        <h1 className="text-2xl font-bold tracking-wide text-center sm:text-left text-white">
          Smart Task Manager
        </h1>

        {/* 👤 User Menu */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full shadow-sm hover:bg-white/20 transition"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold uppercase">
              {userName?.[0] || "U"}
            </div>
            <span className="text-sm font-medium text-white/90">{userName}</span>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className={`absolute sm:right-0 sm:mt-2 mt-3 left-1/2 sm:left-auto transform sm:translate-x-0 -translate-x-1/2 
              w-48 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 transition-all duration-150 
              ${dropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
            >
              <button
                onClick={handleProfile}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                🧑 Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md shadow-xl rounded-2xl mt-10 p-8 relative z-0">
        <h2 className="text-3xl font-semibold text-center mb-8 font-serif">Dashboard</h2>

        <TaskForm onTaskAdded={fetchTasks} />
        <div className="mt-8">
          <TaskList tasks={tasks} onTaskChange={fetchTasks} />
        </div>
      </div>
    </div>
  );
}
