
import { model } from "mongoose";
import * as dbServices from "../../DB/dbServices.js"
import UserModel from "../../DB/models/user.model.js"
//{ defaultImage, defaultImageOnCloud, defaultPublicIdOnCloud } from "../../DB/models/user.model.js";
import { populate } from "dotenv";
import { eventemitter } from "../../../utlis/email/email.event.js";
import bcrypt from "bcrypt";
import { uploadCloud } from "../../../utlis/file uploading/multerCloud.js";
import fs from "fs";

export const getprofile =async(req,res,next)=>{
    const user=await dbServices.findOne({
model:UserModel,

data:{_id:req.user._id},
//populate:[{
  // path:"viewers.userId",select:"username email  - _id"
//select:"- _id"
   // }]
    });

return res.status(200).json({success:true,user})
}
///////////////////////////////////////////////////////////////
export const shareprofile =async(req,res,next)=>{
const {profileId}=req.params;
if(profileId ===req.user._id.toString())
     user=req.user;
else{
 const user=await dbServices.findOneAndUpdate({
    model:UserModel,
    filter:{_id:profileId,isdeleted:false},
   data:{
    $push:{
        viewers:{
      userId:req.user._id,
      time:Date.now() }

          }
         },
select:"username email img"
})
}
//if(!user) return next(new Error("user not found",{cause:404}));
return res.status(200).json({access:true})
}
///////////////////////////////////////////////////////////////////////////////////
export const updateEmail=async(req,res,next)=>{

    const {email}=req.body;
    if(await dbServices.findOne({
 model:UserModel,
 data:{email}
  }))
  return next(new Error("email already exist",{cause:409}))
await dbServices.findOneAndUpdate({model:UserModel,filter:{_id:req.user._id},data:{tempEmail:email}})

eventemitter.emit("sendEmail",req.user.email,req.user.username)
eventemitter.emit("updateEmail",email,req.user.username)

return res.status(200).json({success:true,message:"done"})

}
/////////////////////////////////////////////////////////////////////////////////////
export const reset_email =async(req,res,next)=>{
    const {oldcode,newcode}=req.body;
    console.log(req.user)
    console.log(newcode);
    console.log(req.user.confirmTempEmailotp)
   // console.log(bcrypt.compareSync("QBEUh","$2b$10$9B3Ab.GtmxEWAv96mgXB7erO.3Mb5BYNjlRzg9dO/RP1l4IoJRuF6"))
    const oldMatch=bcrypt.compareSync(oldcode,req.user.confirmEmailotp);
    const newMatch=bcrypt.compareSync(newcode,req.user.confirmTempEmailotp);
    console.log(newMatch)
    if(!oldMatch)
        return next(new Error("in valid code"),{cause:400});
    await dbServices.updateOne({
        model:UserModel,
        filter:{_id:req.user._id},
        data:{email:req.user.tempEmail,changedCredentialsTime:Date.now(),$unset:{tempEmail:"",confirmTempEmailOpt:"",confirmEmailotb:""}}
    })
    return res.status(200).json({message:"true"})
}
///////////////////////////////////////////////////////////////////////////////////////
export const update_password =async(req,res,next)=>{
    const {oldPassword,newPassword}=req.body;
    const comparePass=compare({data:oldPassword,hashdata:req.user.password})
    if(!comparePass)return next(new Error("invalid password",{cause:400}))
        await dbServices.updateOne({model:UserModel,
    filter:{_id:req.user._id},
    date:{password:hash({data:newPassword,number:10}),
        changedCredentialsTime:Date.now()}})
return res.status(200).json({cuccess:true,message:"password updated successfuly"})
}
//////////////////////////////////////////////////////////////////////////////////////
export const updateProfile=async(req,res)=>{
await dbServices.findOneAndUpdate({model:UserModel,
filter:{_id:req.user._id},
    data:req.body,
    options:{new:true,runValidators:true}})
return res.status(200).json({success:true,message:"profile updated successfully!"});
}
/////////////////////////////////////////////////////////////////////////////////////////
export const profilePicture=async(req,res,next)=>{
    const user =await dbServices.findOneAndUpdate({model:UserModel,filter:{_id:req.user.id},
    data:{image:req.file.path},

option:{new:true}})
return res.status(200).json({success:true,data:{user}});
}
////////////////////////////////////////////////////////////////////////////////////////////
export const coverImages =async(req,res,next)=>{
const user=await dbServices.findOneAndUpdate({model:UserModel,
    filter:{_id:req.user._id},
    data:{coverImages:req.files.map((obj)=>obj.path)},
     Option:{new:true}   
    })
    return res.status(200).json({success:true,data:{user}});
}
////////////////////////////////////////////////////////////////////////
export const deleteProfileImage=async(req,res,next)=>{
    const user=await dbServices.findById({model:UserModel,id:{_id:req.user._id}})
    const imagePath=path.resolve(".",user.image);
    fs.unlinkSync(imagePath);
    user.image=defaultImage;
    await user.save()
    return res.status(200).json({success:true,result:user})
}

////////////////////////////////////////////////////////////////////////////////////////

export const deleteProfileImageoncloud=async(req,res,next)=>{
    const user=await dbServices.findById({model:UserModel,id:{_id:req.user._id}})
    const result=await cloudinary.uploader.destroy(user.image.public_id)

    user.image={
secure_url:defaultImageOnCloud,
public_id:defaultPublicIdOnCloud

    }
    await user.save()
    return res.status(200).json({success:true,result:user})
}


//////////////////////////////////////////////////////////////
export const  uploadImageOnCloud=async(req,res,next)=>{
const user=await  dbServices.findById({model:UserModel,id:{_id:req.user._id}})
const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:`/users/${user._id}/profilepicture`})
user.image={secure_url,public_id};
await user.save();

return req.status(200).json({message:"done"})
};
////////////////////////////////////////////////////////////////
export const friendRequest=async(req,res,next)=>{
const friendId=req.params;
const user=req.user;
const friend=dbServices.findOne({model:UserModel,data:{_id:friendId,isdeleted:false},})
if(!friend)
    return next(new Error("friend not found",{cause:404}))
if(user.friendRequest.map(String).include(friend._id.toString())||friend.friendRequest.map(String).include(user._id.toString()))
    return next(new Error("can not  request"))
friend.friendRequest.$push(user._id);
await friend.save();
res.status(200).json({message:"is done",success:true})

};
///////////////////////////////////////////////////////////////////
export const acceptFriendRequest=async(req,res,next)=>{
const friendId=req.params;
const user=req.user;
const friend=dbServices.findOne({model:UserModel,data:{_id:friendId,isdeleted:false},})
if(!friend)
    return next(new Error("friend not found",{cause:404}))
if(user.friends.map(String).include(friend._id.toString())||friend.friends.map(String).include(user._id.toString()))
    return next(new Error("is friend"))

user.friends.push(friendId);
friend.friends.push(user._id);
user.friendId=user.friendRequest.map(String).filter((id=>{id!=friendId.toString()}))
await friend.save();
await user.save();
res.status(200).json({message:"is done",success:true})

}