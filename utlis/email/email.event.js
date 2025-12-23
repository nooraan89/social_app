import EventEmitter from "events";
import { nanoid } from "nanoid"
import { sendEmail } from "./sendEmail.js";
import { hash } from "bcrypt";
import UserModel from "../../src/DB/models/user.model.js";
import {signUp} from "./generalHtml.js"
import { updateEmail } from "../../src/modules/user/user.service.js";
import *as dbServices from "../../src/DB/dbServices.js"
import bcrypt from "bcrypt"
export const eventemitter =new EventEmitter();
export const subject={
    verifyEmail:"verifyEmail ",
    resetpassword:"resetpasswordt ",
    updateEmail:"updateEmail"
    }

const sendCode=async({
    data={},
    subjectType=subject.verifyEmail})=>{
const {email,username,id}=data;
   console.log(email)
    const code=nanoid(5);
  //  console.log(code)
    const hashcode=bcrypt.hashSync(code,10);
    let updateData={};
    console.log(code)
    console.log(subjectType)
    switch (subjectType) {
        case subject.verifyEmail:
            updateData={confirmEmailotp: hashcode} ;
            break;
            case subject.updateEmail:
                updateData= { confirmTempEmailotp: hashcode };

            break;

     case subject.resetpassword:
        updateData={forgetpasswordotp: hashcode} ;

            
            break;
        default:
            break;
    }
   console.log(updateData)
    await dbServices.updateOne({model:UserModel,filter:
        {email},data:updateData});
    await  sendEmail({to:email,subjectType:subject.verifyEmail,html:signUp(username,code)});
    }
    ///////////////////////////////////////////////////////////////////////////////////////////
    eventemitter.on("sendEmail",async(email,username,subjectType)=>{
         await sendCode({
             data:{email,username},
             subjectType:subject.verifyEmail
         })    

        //console.log(updateData)
     
     })
    
     eventemitter.on("forgetPassword",async(email,username,subjectType)=>{
         await sendCode({
            data:{ email,username},
             subjectType:subject.resetpassword
         });
     });
     
     eventemitter.on("updateEmail",async(email,username,subjectType)=>{
         await sendCode({
             data:{email,username},
          subjectType:subject.updateEmail
         
         })
        })
         
         
         //const updatecode=nanoid(5);
        // console.log(code)
         //const hashupdatecode=bcrypt.hashSync(updatecode,10);
         //await UserModel.findOneAndUpdate({
           //  email,confirmTempEmailOpt:hashupdatecode});
         //await  sendEmail({to:email,subject:subject.updateEmail,html:signUp(username,updatecode,subject.updateEmail)});
    
     