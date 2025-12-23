import { Router} from "express";
import * as chatservice from "./chat.service.js"
import { authentication } from "../../middlewares/auth.middellwer.js";
import { asyncHandler } from "../../../utlis/error_handling/asyncHandler.js";
import { validation } from "../../middlewares/validation.middlewares.js";
import { getChatSchema, sendMessageSchema } from "./chat.validation.js";
import {fileValidation, upload}from "../../../utlis/file uploading/multerUploading.js";
import { uploadCloud } from "../../../utlis/file uploading/multerCloud.js";

const router =Router();
router.get("/:friendId",authentication,validation(getChatSchema),asyncHandler(chatservice.getchat))
router.post("/message/:friendId",authentication,validation(sendMessageSchema),asyncHandler(chatservice.sendMessage))


export default router;