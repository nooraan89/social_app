import joi from "joi"
import { generalField } from "../../middlewares/validation.middlewares.js"
export const shareprofileSchema=joi.object({
    profileId:generalField.id.required()


}).required();
export const updatEmailSchema=joi.object({
email:generalField.email.required()

}).required();
export const resetEmailSchema=joi.object({
oldcode:generalField.code.required(),
newcode:generalField.code.required()
}).required();
export const updatePasswordSchema=joi.object({
oldpassword:generalField.password.required(),
newPassword:generalField.password.not(joi.ref("oldPassword")).required

}).required()
export const updateProfileSchema=joi.object({
username:generalField.username,
//dob:generalField.dob,
//phone:generalField.phone,
//gender:generalField.gender,

}).required();
export const friendRequestSchema=joi.object({
    friendId:generalField.id.required()
}).required();
export const acceptFriendRequestSchema=joi.object({
    friendId:generalField.id.required()
}).required()