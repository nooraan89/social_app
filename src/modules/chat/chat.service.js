import { model } from "mongoose";
import * as dbServices from "../../DB/dbServices.js"
import ChatModel from "../../DB/models/chat.models.js"
//{ defaultImage, defaultImageOnCloud, defaultPublicIdOnCloud } from "../../DB/models/user.model.js";
import { populate } from "dotenv";
import { eventemitter } from "../../../utlis/email/email.event.js";
import bcrypt from "bcrypt";
import { uploadCloud } from "../../../utlis/file uploading/multerCloud.js";
import fs from "fs";

import UserModel from "../../DB/models/user.model.js";
export const getchat=async(req,res,next)=>{
const {friendId}=req.params;
const friend=await dbServices.findOne({model:UserModel,data:{id:friendId}
})
const chat=await dbServices.findOne({model:ChatModel,data:{users:{$all:[req.user._id,friendId]}}})

res.status(200).json({success:true,result:chat.message}
)};
////////////////////////////////////////////////////////////////////////
export const sendMessage=async(req,res,next)=>{
const {friendId}=req.params;
const friend=await dbServices.findOne({model:UserModel,data:{id:friendId}});
if(!friend)
    return next(new Error("user not found"));
const chat=await dbServices.findOne({model:ChatModel,data:{users:{$all:[req.user._id,friendId]}}})

if(!chat)
{

await dbServices.create({model:ChatModel,data:{
users:{$all:[req.user._id,friendId]},
messages:[{sender:req.user._id,content}]
}})}
else{
    await chat.messages.push({sender:req.user._id});
    await chat.ssave()
}
let chatPopulate=await dbServices({model:ChatModel,data:{id:chat._id},populate:[{path:"users"}]});
return res.status(201).json({result:chatPopulate})
}




    
