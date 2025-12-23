import  joi from "joi";
import {rolestype} from "../../middlewares/auth.middellwer.js"
export const  registerSchema =joi.object({
username:joi.string().min(3).max(20).required(),
email:joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:{allow:["com","net"]}}).required(),
password:joi.string().required(),
confirmpassword:joi.string().valid(joi.ref("password")).required(),
phone:joi.number().required(),
role:joi. valid(...Object.values([rolestype]))
}).required()
////////////////////////////////////////////////////
export const loginAscheama=joi.object({
email:joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:{allow:["com","net"]}}).required(),
password:joi.string().required(),

}).required();
////////////////////////////////////////////////////
export const confirmScheama=joi.object({
    email:joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:{allow:["com","net"]}}).required(),
    code:joi.required(),
}).required();
//////////////////////////////////////////////////
export  const forgetPasswordScheama=joi.object({
    email:joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:{allow:["com","net"]}}).required()
}).required();
///////////////////////////////////////////////////
export const resetPasswordscheama=joi.object({
    email:joi.string().email({minDomainSegments:2,maxDomainSegments:2,tlds:{allow:["com","net"]}}).required(),
    password:joi.string().required(),
    cod:joi.string().required(),
    }).required();