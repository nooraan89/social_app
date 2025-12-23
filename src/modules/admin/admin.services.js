import CommentModel from "../../DB/models/comment.model.js";
import* as  dbservices from "../../DB/dbServices.js"
import { uploadCloud } from "../../../utlis/file uploading/multerCloud.js";
import cloudinary from "../../../utlis/file uploading/cloudineryconfig.js";
import PostModel from "../../DB/models/post.model.js";
import UserModel, { rolesType } from "../../DB/models/user.model.js";
 export const  getAll=async(req,res,next)=>{
  const results=  Promise.all=([PostModel.find({},UserModel.find({}))])
return res.status(200).json({message:"results"})
}
export const  changeRole=async(req,res,next)=>{
const{role,userId}=req.body;



}