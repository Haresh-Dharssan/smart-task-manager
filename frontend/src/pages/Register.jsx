import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [otp, setOtp] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showOTPchoices, setOTPchoices] = useState(false);
  const [OtpMethod, setOtpMethod] = useState("");
  const navigate = useNavigate();

  const sendPhoneOtp = async () => {
    try{
      await API.post("/users/send-phone-otp", { phone : form.phone });
      toast.success("OTP sent!");
    }catch(error){
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };
  
  const sendEmailOtp = async () => {
    try {
      await API.post("/users/send-email-otp", { email : form.email });
      toast.success("OTP sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    }
  };

  const handleValidate =async () => {
    try {
      if (!form.name || !form.email || !form.password || !form.phone) {
        toast.error("Please fill all fields");
        return;
      }
      await API.post("/users/validate", {...form});
      setOTPchoices(true);
    } catch (error) {
      toast.error(error.response?.data?.message || "Validation failed");
    }
  };
  
  const verifyandSignUp = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/verifyotp", { email : form.email, phone : form.phone, otp : otp, method : OtpMethod });
      if (data.valid) {
        const { data } = await API.post("/users/register", { ...form});
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Registered successfully!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
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
        <label className="block mb-1 text-sm font-medium">Phone Number</label>
        <input
          type="tel"
          placeholder="Phone number"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full p-3 rounded-lg text-gray-900 mb-3 focus:outline-none"
        />
        <label className="block mb-1 text-sm font-medium">Set Password</label>
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
        {showOTPchoices && (
          <div className="fixed inset-0 bg-black/40 rounded-xl backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative">
              <button
                onClick={() => setOTPchoices(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                x
              </button>
              <h2 className="text-xl font-semibold mb-6 text-center text-gray-900">
                Choose Verification Method
              </h2>
              <button
                onClick={() => {
                  setOtpMethod("email");
                  sendEmailOtp();
                  setOTPchoices(false);
                  setShowOTPModal(true);
                }}
                className="w-full p-3 mb-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Verify via Email
              </button>

              <button
                onClick={() => {
                  setOtpMethod("phone");
                  sendPhoneOtp();
                  setOTPchoices(false);
                  setShowOTPModal(true);
                }}
                className="w-full p-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700"
              >
                Verify via Phone
              </button>
            </div>
          </div>
        )}

        {showOTPModal && (
          <div className="fixed inset-0 bg-black/40 rounded-xl backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm relative">
              <button
                onClick={() => setShowOTPModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl"
              >
                x
              </button>

              <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">
                {OtpMethod === "email" ? "Email Verification" : "Phone Verification"}
              </h2>

              <h3 className="text-xl font-semibold mb-4 text-center text-gray-700">
                Enter the OTP sent to your {OtpMethod === "email" ? "email" : "phone number"}
              </h3>
              
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 mb-3 text-gray-800 border rounded-lg focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={verifyandSignUp}
                className="w-full py-2 bg-green-600 text-white  rounded-lg hover:bg-green-700"
              >
                Verify OTP
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
