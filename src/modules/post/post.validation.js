
import joi from "joi";
 import { generalField } from "../../middlewares/validation.middlewares.js"
export const creatPostSchema =joi.object({
    content:joi.string().min(2).max(5000),
    file:joi.array().items(joi.object(generalField.fileobject))
}).required()
export const updateSchema=joi.object({
    postId:generalField.id.required(),
    content:joi.string(),
    file:joi.array().items(joi.object(generalField.fileobject))
}).required()

export const deletePostSchema=joi.object({
postId:generalField.id.required()
    
}).required()

export const getPostSchema=joi.object({
postId:generalField.id.required()

}).required();
export const likePostSchema=joi.object({
postId:generalField.id.required()

}).required();