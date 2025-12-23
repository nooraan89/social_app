import { Router } from "express";
const router=Router()
import * as authservices from "./auth.services.js"
import {registerSchema,loginAscheama,confirmScheama,forgetPasswordScheama}from "./auth.validation.js";
import { validation } from "../../middlewares/validation.middlewares.js";
router.post("/rejister",validation(registerSchema),authservices.register)
router.post("/login",validation(loginAscheama),authservices.login)
router.patch("/confirmemail",validation(confirmScheama),authservices.confirmEmail)
router.post("/refresh_token",authservices.refreshToken)
router.post("/forget_password",validation(forgetPasswordScheama),authservices.forget_password)

router.patch("/reset_password",authservices.reset_password)




export default router;