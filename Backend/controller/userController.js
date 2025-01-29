
import UserModel from "../models/LoginModel.js"

export const getUserData = async(req , res) =>{
  try {
      const {userId} = req.body
      const user = await UserModel.findById(userId)

      if(!user){
        return res.json({sucess:false , message:"User Not Found"})
      }

      res.json({sucess:true , userData:{
        name : user.username,
        isAccountVerified : user.isAccountVerified
      }})
      
    } catch (error) {
      return res.json({sucess:false , message:error.message})
    }
}