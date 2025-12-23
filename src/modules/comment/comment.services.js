import CommentModel from "../../DB/models/comment.model.js";
import* as  dbservices from "../../DB/dbServices.js"
import { uploadCloud } from "../../../utlis/file uploading/multerCloud.js";
import cloudinary from "../../../utlis/file uploading/cloudineryconfig.js";
import{ PostModel} from "../../DB/models/post.model.js";
import UserModel from "../../DB/models/user.model.js";
import { rolestype } from "../../middlewares/auth.middellwer.js";
import bodyParser from "body-parser";
import { Error } from "mongoose";
import { nanoid } from "nanoid";
export const updateComment=async(req,res,next)=>{
console.log("ok")
   const {commentId}=req.params;
   const{text}=req.body;
   const comment=await dbservices.findOne({model:CommentModel,data:{_id:commentId}});
   if(!comment)
    return next(new Error("comment not found"))
const post=await dbservices.findOne({model:PostModel,data:{_id:comment.postId}})
   if(!post)
     return next(new Error("post not found"))
console.log(post)

if(req.user._id.toString()!==comment.createdBy.toString())
    return(new Error ("inauthorized",{case:401}))

let image;
   if(req.file){
    
const {public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`posts/${req.user._id}/posts/${post.customId}/comment`})
image={public_id,secure_url}
   
if(comment.images)
    {
        await cloudinary.uploader.destroy(comment.image.public_id,{folder:`posts/${req.user._id}/posts/${post.customId}/comment`})}
        comment.image=image;
        console.log(comment.image)
    }

    comment.text=text?text:comment.text;


comment.save();
return res.status(201).json({success:true,resault:comment})
}
///////////////////////////////////////////////////////////////
export const creteComment=async(req,res,next)=>{
const {text}=req.body;
const {postId}=req.params;
console.log("postId"+"  "+ postId)
const post=await dbservices.findOne({model:PostModel,data:{_id:postId}})
if(!post)
    return next(new Error("post not found"))
let image
;
if(req.file){
const {secure_url,public_id}=await cloudinary.uploader.upload(
    req.file.path,
    {folder:`posts/${post.createdBy}/posts/${post.customId}/comment`})
 image={secure_url,public_id}}
console.log(image)
const comment=await dbservices.create({model:CommentModel,
    data:{text,postId:post._id,createdBy:req.user._id,image}})
return res.status(201).json({success:true,result:{comment}})
}
////////////////////////////////////////////////////////////////////
export const softdeleteComment=async(req,res,next)=>{
    const {commentId}=req.params;
    const comment=await dbservices.findOne({model:CommentModel,data:{_id:commentId}});
    if(!comment)
        return next(new Error("comment not found!"));
    const post=await dbservices.findOne({model:PostModel,data:{_id:comment.postId}});
    if(!post)
        return next(new Error("post not found!"));
    if(req.user._id.toString()!==comment.createdBy.toString()&&req.user._id.toString()!==post.createdBy.toString()&&req.user.role!==rolestype.admin)
        return next(new Error("inauthorized"));
    comment.isDeleted=true;
    comment.deleteBy=req.user._id;
    await comment.save();
    return res.status(200).json({success:true})

}

/////////////////////////////////////////////////////////////////////////

export const getAllComment=async(req,res,next)=>{
    const {postId}=req.params;
    const post=await dbservices.findOne({model:PostModel,data:{_id:postId}})
    const comments=await dbservices.find({model:CommentModel,
        data:{isDeletd:false,postId},})
        //    parentComment:{$exists:false}
       // },
     // populate:[{path:"replies"}]
     // });
        console.log(comments)
return res.status(200).json({success:true,result:comments})
}
///////////////////////////////////////////////////////////////////////
export const likeUnlike=async(req,res,next)=>{
const {commentId}=req.params;
const comment=await dbservices.findOne({model:CommentModel,data:{_id:commentId,isDeleted:false}});
console.log(comment)
const isUserLiked=comment.likes.find((user)=>user._id.toString()==req.user._id.toString());
if(!isUserLiked)
{
comment.likes.push(req.user._id);
}
else{
 comment.likes= comment.likes.filter((user)=>user._id.toString()!==req.user._id.toString())
}
await comment.save();
return res.status(200).json({success:true})
}
/////////////////////////////////////////////////////////////////////
export const replay=async(req,res,next)=>{
const{postId,commentId}=req.params;
const {text}=req.body;
const comment=await dbservices.findOne({model:CommentModel,data:{_id:commentId,isDeleted:false}});
console.log(comment)
//if(!comment)
 //   return next (new Error("comment not Found" ,{cause:404}));
const post =await dbservices.findOne({model:PostModel,data:{_id:postId,isDeletd:false}})
//if(!post)
  //  return next(new Error("post not found",{cause:404}));
let image;
if(req.file)
    {const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,
        {folder:`posts/${post._id}/posts/${post.customId}/commet/${comment._id}`})
        image={secure_url,public_id};
    
}
const reply=await dbservices.create({model:CommentModel,
    data:{text,
        image,
       createdBy:req.user._id,
        postId,
        parentComment:commentId}
    });
    return res.status(201).json({success:true,result:{reply}})


}
////////////////////////////////////////////////////////////////////

export const deleteComment=async(req,res,next)=>{
    const {postId,commentId}=req.params;
    const comment=await dbservices.findById({model:CommentModel,id:commentId});
    if(!comment)
        return next(new Error("comment not founf"));
    const post =await  dbservices.findById({model:PostModel,id:postId});
    if (!post)
        return next(new Error("post not found"));
    if(req.user._id.toString()!==comment.createdBy.toString()||req.user.role!=="admin"||req.user._id.toString()!==post.createdBy.toString())
        return next (new Error (" inauthorized"))
    await comment.deleteOne();
    return res.status(200).json({message:"comment deleted"})
}