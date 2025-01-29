import mongoose from "mongoose";


const connectdb = async () =>{
    try {
      mongoose.connection.on('connected' , ()=>console.log("Database Connected "));
      
      await mongoose.connect(`${process.env.MONGO_URI}/Mern_auth`)
    } catch (error) {
      console.log("database error try after sometimes " , error.message);
    }
}


export default connectdb