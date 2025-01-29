import mongoose from "mongoose";

const userSchema = mongoose.Schema({

  email:{type:String, required:true , unique:true},
  password:{type:String, required:true},
  username:{type:String, required:true},
  verifyOtp:{type:Number, default:0},
  verifyOtpExpireAt:{type:Number, default:0},
  isAccountVerified:{type:Boolean , default:false},
  resetOtp:{type:Number , default:0},
  resetOtpExprieAt:{type:Number , default:0},

}, {timestamps:true})

export default mongoose.model("User" , userSchema )