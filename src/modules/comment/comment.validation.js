
import joi from "joi";
import { generalField } from "../../middlewares/validation.middlewares.js";
export const createcommentSchema=joi.object({
text:joi.string(),
file:joi.object(generalField.fileobject),
postId:generalField.id.required()

}).or("text","file")
export const updateCommentSchema=joi.object({
text:joi.string().min(2).max(5),
file:joi.object(generalField.fileobject),
postId:generalField.id.required(),
commentId:generalField.id.required()
}).or("text","file")
export const sofDeleteCommentSchema=joi.object({
commentId:generalField.id.required()

}).required();
export const likeorunlikeSchema=joi.object({

commentId:generalField.id.required()

}).required();
export const replaySchema=joi.object({
    postId:generalField.id.required(),
    commentId:generalField.id.required()
}).required();