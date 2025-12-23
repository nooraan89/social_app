import joi from "joi"
import { generalField } from "../../middlewares/validation.middlewares.js"
export const getChatSchema=joi.object({
    chatId:generalField.id.required()


}).required();
export const sendMessageSchema=joi.object({
email:generalField.email.required()

}).required();