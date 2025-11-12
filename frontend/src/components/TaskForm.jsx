import { useState } from "react";
import API from "../services/api";

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); 

    if (dueDate && new Date(dueDate) < Date.now()) {
      setErrorMessage("⚠️ Due date cannot be in the past.");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    try {
      await API.post("/tasks", { title, description, dueDate });
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
      <div className="flex flex-col gap-2 mt-4">
        <label className="text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="p-3 border border-gray-300 text-gray-400 rounded-lg focus:outline-none focus:ring-2"
        />
      </div>
      {errorMessage && (
        <p className="mt-3 text-sm text-red-600 font-medium">{errorMessage}</p>
      )}
    </form>
  );
}
