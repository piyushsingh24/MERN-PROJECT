import express from 'express'
import { forgetPassword, isauthenticed, login, logout, register, Verify, verifyForgetPassword } from '../controller/authcontroller.js'
import { findCookies } from '../middleware/findCookies.js'

const   router = express.Router()

router.post("/register" , register)
router.post("/login" , login)
router.post("/logout" , logout )
router.post("/verify" ,findCookies , Verify)
router.post("/forget-password" , forgetPassword)
router.post("/verify-forget-password" ,verifyForgetPassword)
router.get("/is-auth" , findCookies, isauthenticed)

export default router