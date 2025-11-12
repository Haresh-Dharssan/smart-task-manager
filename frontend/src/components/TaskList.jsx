import API from "../services/api";
import { useState } from "react";

export default function TaskList({ tasks, onTaskChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("default");

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      onTaskChange();
    } catch (error) {
      console.error(error.response?.data?.message || "Error deleting task");
    }
  };

  const toggleStatus = async (task) => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    try {
      await API.put(`/tasks/${task._id}`, { status: newStatus });
      onTaskChange();
    } catch (error) {
      console.error(error.response?.data?.message || "Error updating task");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const query = searchTerm.toLowerCase();
    return (
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOption === "completed") {
      return a.status === "completed" && b.status !== "completed" ? -1 : 1;
    } else if (sortOption === "pending") {
      return a.status === "pending" && b.status !== "pending" ? -1 : 1;
    } else {
      return 0;
    }
  });

  if (tasks.length === 0) {
    return <p className="text-center text-white mt-6">No tasks yet.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-between" >
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
         <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full sm:w-52 p-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="default">Sort by: Default</option>
          <option value="completed">Sort by: Completed</option>
          <option value="pending">Sort by: Pending</option>
        </select>
      </div>
    <ul className="space-y-4">
      {sortedTasks.length > 0 ? (
          sortedTasks.map((task) => {
        const createdAt = new Date(task.createdAt);
        const day = createdAt.getDate();
        const month = createdAt.toLocaleString("en-US", { month: "short" }); 
        const year = String(createdAt.getFullYear()).slice(-2); 
        const time = createdAt.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }); 
      
        return (
          <li
            key={task._id}
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-stretch sm:items-center gap-4">
              
              <div className={`w-20 flex-shrink-0 text-center text-sm ${
                task.status === "completed"
                  ? "bg-green-200 text-green-700 "
                  :  "text-red-700 bg-red-200 "
              }  rounded-md font-medium`}>
                <p className={`font-semibold text-base`}>{`${day} ${month} ${year}`}</p>
                <p className={`text-xs mt-1`}>{time}</p>
              </div>

              <div className={`self-stretch border-l-2 mx-3 ${
                task.status === "completed"
                  ? "border-green-600"
                  : "border-red-500"
              }`}></div>

              <div>
                <h3
                  className={`font-semibold text-lg ${
                    task.status === "completed"
                      ? "line-through text-gray-400"
                      : "text-gray-800"
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-sm text-gray-500 break-words whitespace-pre-wrap">
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-gray-500 mt-1">
                    📅 Due: {new Date(task.dueDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 mt-3 sm:mt-0">
              <button
                onClick={() => toggleStatus(task)}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  task.status === "completed"
                    ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                } transition-colors duration-200`}
              >
                {task.status === "completed" ? "Mark Pending" : "Mark Done"}
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        );
      })
    ) : (
          <p className="text-center text-gray-500 mt-6">
            No matching tasks found.
          </p>
    )}
    </ul>
  </div>
  );
}
