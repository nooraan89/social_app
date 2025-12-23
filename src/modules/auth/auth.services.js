import UserModel from "../../DB/models/user.model.js";
 import { hash,compare } from "../../../utlis/hash/hash.js";
 import bcrypt from "bcrypt"
import { eventemitter } from "../../../utlis/email/email.event.js";
import { subject } from "../../../utlis/email/email.event.js";
import *as dbServices from "../../DB/dbServices.js"
import { asyncHandler } from "../../../utlis/error_handling/asyncHandler.js";
import { token } from "../../../utlis/token/token.js";
import { rolestype } from "../../middlewares/auth.middellwer.js";
 export const register=async(req,res,next)=>{
    console.log("no")
const{username,email,password,confirmpassword,phone,role}=req.body;
if(password!=confirmpassword)
  return next(new Error("password not match"));

    if(await dbServices.findOne({model:UserModel,data:{email}}))
         return next(new Error("user already exists",{cause:409}));
   const hashpassword=hash({data:password,number:10});
//user= await dbServices.create({
//    model:UserModel,
  //  data:{username,email,password:hashpassword,phone}});
  const user=await UserModel.create({username,email,password:hashpassword,confirmpassword,phone,role})
eventemitter.emit("sendEmail",email,username,subject.verifyEmail)

return res.status(201).json({message:"user rejisted successfully!",results:user})

 }
 ////////////////////////////////////////////////////////////////////////////////////////////////////
 export const login=async(req,res,next)=>{
const {email,password}=req.body;
const user=await dbServices.findOne({
    model:UserModel,
    data:{email}})
if(!user)
    return next(new Error("user not found",{cause:404}))
console.log(user)
console.log(user.password)
const match=bcrypt.compareSync(password,user.password)
if(!match)
    return next(new Error("password is not correct",{cause:403}))
    if(user.isconfirmEmail==false)
        return next (new Error("please confirm your account"))
        if (user.isdeleted==="true"){user.isdeleted=false;user.save()}
    
//const token=token({id:user._id},"joo")
const access_token = token({data:{_id:user._id,},secretkey:
    user.role===rolestype.user?
    process.env.TOKEN_ACCESS_USER
    :process.env.TOKEN_ACCESS_ADMIN,options:
    {expiresIn:process.env.EXPIER_ACCESS}})
const refresh_token = token({data:{_id:user._id},secretkey:
    user.role===rolestype.user?
    process.env.TOKEN_REFRESH_USER
    :process.env.TOKEN_REFRESH_ADMIN,
options:{expiresIn:process.env.EXPIER_REFRESH}})
return res.status(200).json({stack:true,message:"user loging in successfally ",results:{access_token,refresh_token
}})
}
///////////////////////////////////////////////////////////
export const confirmEmail=async(req,res,next)=>{
const {code,email}=req.body;
const user =await dbServices.findOne({model:UserModel,data:{email}});
if(!user)
    return next(new Error("user not exist",{cause:404}))
    if(user.isconfirmEmail===true)
        return next (new Error("email already verified",{cause:409}))
    console.log(code);
    console.log(user.confirmEmailotp)
    const check=bcrypt.compareSync(code,user.confirmEmailotp)
 if(!check)
    return next(new Error("invalid code",{cause:400}));
await UserModel.findOneAndUpdate({email},{isconfirmEmail:true,$unset:{confirmEmailotb:""}})
return res.status(200).json({success:true,message:"user verified successfully"})
}
/////////////////////////////////////////////////////////////
export const forget_password=async(req,res,next)=>{
const {email}=req.body;
const user=await dbServices.findOne({
    model:UserModel,
    data:{email}})
if (!user)
    return next(new Error("usernot exist",{cause:404}));
console.log(user.email)
eventemitter.emit("forgetPassword",user.email,user.username,subject.subjectType);
return res.status(200).json({message:"done"})

}
//////////////////////////////////////////////////////////////
export const reset_password =async(req,res,next)=>{
    const {code,password,email}=req.body;
    const user=await dbServices.findOne({model:UserModel,
        data:{email,isdeleted:false}})
    if(!user)
        return  next(new Error("user not exist"))
    console.log(code);
    console.log(user.forgetpasswordotp)
    const check=bcrypt.compareSync(code,user.forgetpasswordotp);
    console.log(check)
    if(!check)
        return next(new Error("invalid code",{cause:409}));
    
   const  hashpassword=bcrypt.hashSync(password,10);
   await dbServices.updateOne({
    model:UserModel,
   filter: {email},
   data:{password:hashpassword,$unset:{forgetpasswordotp:""}}})
return res.status(200).json({message:"password updted successfully!"})
}
///////////////////////////////////////////////////////////
export const refreshToken=async()=>{
    const {authorization}=req.header;
const user=await decodedToken({
authorization,
tokenType : tokenTypes.refresh,
next
})
    const access_token = token({data:{id:user._id},secretkey:
        user.role===rolesType.user?
        process.env.TOKEN_ACCESS_USER
        :process.env.TOKEN_ACCESS_ADMIN,
        options:{expiresIn:process.env.EXPIER_ACCESS}})
    const refresh_token = token({data:{id:user.id},secretkey:
        user.role===rolesType.user?
        process.env.TOKEN_REFRESH_USER
        :process.env.TOKEN_REFRESH_ADMIN,
    options:{expiresIn:process.env.EXPIER_REFRESH}})
return res.status(200).json({access:true,results:{access_token,refresh_token}})



}