import { useState } from "react";
import API from "../services/api";

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      onTaskAdded();
    } catch (error) {
      console.error(error.response?.data?.message || "Error adding task");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-5 rounded-xl shadow-sm border border-gray-200"
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="flex-1 p-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Add Task
        </button>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          className="flex-1 p-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 resize-none break-words whitespace-pre-wrap "
        />
      </div>
    </form>
  );
}
