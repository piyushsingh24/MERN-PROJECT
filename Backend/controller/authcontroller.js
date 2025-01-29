import UserModel from "../models/LoginModel.js"
import brcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import transporter from '../config/nodemailer.js'
import env from 'dotenv'
import {EMAIL_VERIFY_TEMPLATE , PASSWORD_RESET_TEMPLATE} from "../config/emailTemplate.js"


import {  forgetPasswordOtp, verifyOtpEmail, welcomeEmail } from "../sendingemail/emailFormat.js"

env.config()

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  if (!email, !password, !username) {
    return res.json({
      sucess: false, message: "Missing Details"
    })  
  }
  try {
    const extingUser = await UserModel.findOne({ email })
    if (extingUser) {
      return res.json({ sucess: false, message: "User Already Exists" })
    }
    
    //password hasing using bcrpyt js 
    const hashedpassword = await brcrypt.hash(password, 10);
    const User = await new UserModel({ username, password: hashedpassword, email })
    await User.save();

    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET_TOKEN, { expiresIn: "7d" })

    //its help to set the cookie
    res.cookie("token", token, {
      httpOnly: true, //only  http request can access this cookie 
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? 'none' : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // maximum age or limit to store the cookie 
    })
    
    //----------------------------------------------------------------------------------------
    
    try {
      await transporter.sendMail(welcomeEmail(email));
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
    }
    
    try {
      const otp =  Math.floor(100000 + Math.random() * 900000);
      User.verifyOtp = otp
      User.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 *1000;
      await User.save()
      await transporter.sendMail(verifyOtpEmail(User , otp));

    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
    }
    //----------------------------------------------------------------------------------------

    res.status(200).json({sucess:true , message:"User Create Sucessfully"})

  } catch (error) {
    res.json({
      sucess: false,
      message: error.message
    })
  }
}


export const  login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.json({
      sucess: false,
      message: "Missing field is required to fill"
    })
  }

  try {
    const User = await UserModel.findOne({ email })
    if (!User) {
      return res.json({
        sucess: false,
        message: "Invalid user Credentials"
      })
    }
    const ismatch = await brcrypt.compare(password, User.password)

    if (!ismatch) {
      return res.json({
        sucess: false,
        message: "Invalid User Credentials"
      })
    }

    const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET_TOKEN, { expiresIn: "7d" })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expiresIn: 7 * 24 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict'
    })

    res.status(200).json({sucess:true , message:"User LOGGED in Sucessfully"})

  } catch (error) {
    res.status(401).json({
      sucess: false,
      message: error.message
    })
  }
}

export const logout = (req ,res)=>{
  
  try {
    res.clearCookie( 'token' ,{
      httpOnly:true,
      secure:process.env.NODE_ENV === "production",
      sameSite:process.env.NODE_ENV === 'production' ? "none" : "strict"
    })

    return res.status(200).json({
      sucess:true , message:"User sucessfully logout"
    })
  } catch (error) {
    res.status(401).json({sucess:false , message:error.message})
  }
}

//verify the Mail 
export const Verify = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    // Find the user
    const user = await UserModel.findById(userId);
    
    // If the user or OTP is missing, return an error
    if (!user || !otp) {
      return res.json({ success: false, message: "User not found! Please login again." });
    }

    // If the account is already verified, return a message
    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account is already verified." });
    }

    // Check if the OTP has expired
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired. Please request a new one." });
    }

    // Verify the OTP
    if (user.verifyOtp == otp) {
      user.isAccountVerified = true;
      user.verifyOtp = 0;
      user.verifyOtpExpireAt = 0; // Reset OTP and expiry

      // Save the updated user and send a response
      await user.save();

      return res.json({ success: true, message: "Account verified successfully!" });
    } else {
      return res.json({ success: false, message: "Incorrect OTP. Please try again." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error, please try again later." });
  }
};


export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const User = await UserModel.findOne({ email });
    if (!User) {
      return res.status(404).json({ sucess: false, message: "No user found, create an account" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Set OTP and Expiration
    User.resetOtp = otp;
    User.resetOtpExprieAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Save updated user
    await User.save();

    // Send OTP email
    await transporter.sendMail(forgetPasswordOtp(User , otp));

    return res.status(200).json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "An error occurred: " + error.message });
  }
};



export const verifyForgetPassword = async (req, res) => {
  const { otp, email, newPassword } = req.body;

  try {
    // Check if required fields are missing
    if (!otp || !email || !newPassword) {
      return res.status(400).json({ success: false, message: "Data is Missing" });
    }

    // Find user by email
    const User = await UserModel.findOne({ email });
    if (!User) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if account is verified
    if (!User.isAccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is not verified. Please verify your account first.",
      });
    }

    // Verify OTP and check expiration
    if (User.resetOtp != otp || User.resetOtpExprieAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Check if the new password is the same as the old one
    const isSamePassword = await brcrypt.compare(newPassword, User.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the current password",
      });
    }

    // Hash the new password
    const hashedPassword = await brcrypt.hash(newPassword, 10);
    User.password = hashedPassword;

    // Reset OTP and expiration fields
    User.resetOtp = 0;
    User.resetOtpExprieAt = 0;

    // Save the user data
    await User.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const isauthenticed = async (req , res)=>{
  try {
    res.json({sucess:true})
  } catch (error) { 
    res.json({sucess:false , message:message.error})
  }
}