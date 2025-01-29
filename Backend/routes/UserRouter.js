import express from "express"
import { findCookies } from "../middleware/findCookies.js"
import { getUserData } from "../controller/userController.js"

const router  = express.Router()

router.get("/data", findCookies , getUserData)


export default router