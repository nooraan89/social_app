
import UserModel from "../../DB/models/user.model.js";
import { rolestype } from "../../middlewares/auth.middellwer.js";
import { nanoid } from "nanoid";
import* as  dbservices from "../../DB/dbServices.js"
import cloudinary from "../../../utlis/file uploading/cloudineryconfig.js"
import{PostModel} from "../../DB/models/post.model.js";
import CommentModel from "../../DB/models/comment.model.js";
export const creatPost=async (req,res,next)=>{
    const {content}=req.body;
  
let allImages=[];
 let customId=nanoid(5)
 console.log("API Key:", process.env.CLOUDINARY_API_KEY);
  if (req.files.length){
for (const file of req.files){
  const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`posts/${req.user._id}/post/${customId}`})
allImages.push({secure_url,public_id})
}}
await dbservices.create({model:PostModel,data:{content,images:allImages,createdBy:req.user._id,customId}})
 return res.status(201).json({success:true,Message:"post created successfally"})  
}
////////////////////////////////////////////////////////////////
export const updatePost=async(req,res,next)=>{
 // if (req.user._id!=post.createdBy)
  //  return next(new Error("not found invalid"))
const {content}=req.body;
console.log(content);
const {postId}=req.params;
console.log(postId)
const post=await dbservices.findOne({model:PostModel,data:{_id:postId,createdBy:req.user._id}});
if(!post)return next(new Error("post not found "))
let allImages=[];
if(req.files.length)
{
  for(const file of req.files)
  {
    for (const file of post.images)
   { await cloudinary.uploader.destroy(file.public_id);}
    const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`posts/${req.user._id}/post/${post.customId}`})
    allImages.push({secure_url,public_id});
  }
}
console.log(post.content)
post.images=allImages;
//post.content?content:post.content;
post.content=content;
await post.save();
return res.status(200).json({success:true,Message:"post updated successfully"})
}
//////////////////////////////////////////////////////////////////////
export const deletePost=async(req,res,next)=>{
const {postId}=req.params;
const post=await dbservices.findOne({model:PostModel,data:{_id:postId}})
if(!post)
  return next(new Error("post not found"));
if(req.user._id.toString()===post.createdBy.toString()||req.user.role===rolestype.admin)
{post.isDeleted=true;
post.deletedBy=req.user._id;}
await post.save();
return res.status(209).json({success:true,message:"post deleted succsessfully"})
}
////////////////////////////////////////////////////////////////////////
export const getPost=async(req,res,next)=>{
const {postId}=req.params;
const post =await dbservices.findOne({model:PostModel,
  data:{_id:postId,isDeleted:false},
  populate:[{path:"createdBy",select:"username image -_id"},
    {path:"comments",select:"image text -_id"}]})
if(!post)
  return next(new Error("post not found"));


return res.status(200).json({success:true,result:post})
}
//////////////////////////////////////////////////////////////////
export const activePost=async(req,res,next)=>{
    let result=[]


if(req.user.role===rolestype.admin)
{const posts=await dbservices.find({model:PostModel,
  data:{isDeleted:false},
  populate:[{path:"createdBy", select:"username image -_id"}]})
  for(const post of posts)
 
 {
    const comments=await dbservices.find({model:CommentModel,data:{isDeleted:false,postId:post._id}}) ;
    result.push({post,comments});
 }
  

}
else{console.log ("kkkk")
    console.log(req.user._id)

const posts=await dbservices.find({model:PostModel,
  data:{isDeleted:false,createdBy:req.user._id},
 populate:[{path:"createdBy", select:"username image -_id"}]
})
console.log(posts)
  for(const post of posts)
  {
    const comments=await dbservices.find({model:CommentModel,
      data:{isDeletd:false,
        postId:post._id},
        select:"image  text -_id"}) ;
    console.log(comments)
    result.push({post,comments});
 }
}


return res.status(200).json({success:true,result:{result}});
}
///////////////////////////////////////////////////////////////////////////
export const unactivePost=async(req,res,next)=>{
if(req.user.role===rolestype.admin){
const posts=await dbservices.findOne({model:PostModel,data:{isDeleted:true},populate:{path:"createdBy",select:"username image -_id"}});
}
else{
const posts=await dbservices.findOne({model:PostModel,data:{isDeleted:true,createdBy:req.user._id},populate:{path:"createdBy",select:"username  image -_id"}})
}
return res.ststus(200).json({success:true,result:posts});
}
////////////////////////////////////////////////////////////////////////////
export const likePost=async(req,res,next)=>{
const {postId}=req.params;
const post=await dbservices.findOne({model:PostModel,data:{_id:postId,isDeleted:false}});

const isUserLiked=post.likes.find((user)=>user._id.toString()==req.user._id.toString());
if(!isUserLiked)
{
post.likes.push(req.user._id);
}
else{
 post.likes= post.likes.filter((user)=>user._id.toString()!==req.user._id.toString())
}
await post.save();
const pobulateuser=await dbservices.findOne({model:PostModel,data:{_id:postId},populate:[{path:"likes",select:"username image -_id"}]})
return res.status(200).json({success:true,result:pobulateuser})
}

////////////////////////////////////////////////////////////////////////////////////////////
export const getAllPosts=async(req,res,next)=>{
let {page}=req.query;

const posts=PostModel.find({isDeletd:false}).paginet(page);

return res.status(200).json({success:true,result:{posts}})



}