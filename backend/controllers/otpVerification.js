import dotenv from "dotenv";
import twilio from "twilio";
import nodemailer from "nodemailer";
dotenv.config();

const phoneOtpStore = {};
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
export const sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    phoneOtpStore[phone] = otp;

    await client.messages.create({
      body: `Your verification code is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });

    res.json({ otp }); 
  } catch (err) {
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

const emailOtpStore = {};
export const sendEmailOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  emailOtpStore[email] = otp;
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "TASKY Email Verification",
      text: `Hey buddy, Your OTP for Email Verification is ${otp}`,
    });
    res.json({ message: "Email OTP sent successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

export const verifyOtp = async (req,res) => {
    const { email, phone, otp, method } = req.body;
    if(method === "phone" && phoneOtpStore[phone] && phoneOtpStore[phone] == otp){
        return res.status(200).json({ valid: true, message: "OTP verified successfully" });
    }
    if(method === "email" && emailOtpStore[email] && emailOtpStore[email] == otp){
        return res.status(200).json({ valid: true, message: "OTP verified successfully" });
    }
    return res.status(400).json({ valid: false, message: "Invalid OTP" });
};