import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors"
import env from "dotenv"
import connectdb from "./config/mongoconnect.js";
import authRouter from "./routes/authRouter.js"
import UserRouter from "./routes/UserRouter.js"

env.config()




const app = express();
app.use(cors({credentials:true , origin:"http://localhost:5173"}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
connectdb()

// app.use(cors({
  //   origin:"http://localhost:5173", //allowed request from this source only 
  //   methods:["GET" , "POST"], //kindof request its allowed   
  // }))


// ROTUES
  app.use("/api/auth", authRouter)
  app.use("/api/user" , UserRouter)

app.get("/" , (req,res)=>{
  res.send("hello world ")
})

app.listen(process.env.PORT || 3000 , ()=>{
  console.log("Server is running at port number " , process.env.PORT)
})