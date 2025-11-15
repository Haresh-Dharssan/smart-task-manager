import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [serverOtp, setServerOtp] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try{
      if(!phone) return toast.error("Please enter Phone number first");
      const { data } = await API.post("/users/sendotp", { phone });
      console.log("OTP response:", data);
      toast.success("OTP sent!");
      setServerOtp(data.otp);
    }catch(error){
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleValidate =async () => {
    try {
      if (!form.name || !form.email || !form.password) {
        toast.error("Please fill all fields");
        return;
      }
      await API.post("/users/validate", {...form});
      setShowModal(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Validation failed");
    }
  };

  const handleSubmit = async (e) => {
    
    try {
      const { data } = await API.post("/users/register", {...form, phone, otp : serverOtp , enteredOtp : otp });
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Registered successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-semibold mb-6 text-center">Create Account</h2>
        <label className="block mb-1 text-sm font-medium">Full Name</label>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-3 rounded-lg text-gray-900 mb-3 focus:outline-none"
        />
        <label className="block mb-1 text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-3 rounded-lg text-gray-900 mb-3 focus:outline-none"
        />
        <label className="block mb-1 text-sm font-medium">Password</label>
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-3 rounded-lg text-gray-900 mb-6 focus:outline-none"
        />
        <button
          onClick={handleValidate}
          className="w-full py-3 bg-pink-500 rounded-lg hover:bg-pink-600 transition"
        >
          Sign Up
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 rounded-xl backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                X
              </button>
              <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">Phone Number Verification</h3>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded text-black mb-3 focus:outline-none"
              />

              <button
                onClick={sendOtp}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 mb-3"
              >
                GET OTP
              </button>

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-2 border rounded text-black mb-3 focus:outline-none"
              />
              <button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
              >
                Verify
              </button>
            </div>
          </div>
        )}
        <p className="text-sm text-center mt-6">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-indigo-700 font-semibold cursor-pointer hover:underline"
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}
