import joi from "joi"
import { now, Types } from "mongoose"
export const isValidObjectId=(value,helper)=>{
    return Types.ObjectId.isValid(value)?true:helper.message("invalid id")}

   const genderType={
        male:"male",
        female:"female"
        
        
        }

export const  validation =(schema)=>{
    return (req,res,next)=>{
const data={...req.body,...req.params,...req.query}
//if(req.file||req.files.leangth)
  //  data.file=req.file||req.files;
const results=schema.validate(data,{abortErly:false})

if(results.error){
    const errorMessages = results.error.details.map((obj)=>obj.message);
    return next(new Error(errorMessages,{cause:400}));
}console.log("uuu");
return next();}
}

export const generalField={
    fileobject:{
fieldname:joi.string().required(),
originalname:joi.string().required(),
encoding:joi.string().required(),
mimetype:joi.string().required(),
size:joi.number().required(),
destination:joi.string().required(),
filename:joi.string().required(),


path:joi.string().required(),


    },
username:joi.string().max(20).min(3).trim(),
email:joi.string().email({maxDomainSegments:2,minDomainSegments:2,tlds:{allow:["com","net"]}}),
password:joi.string().pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\w)(?!.*).{8,16}$/)
    ),
    confirmpassword:joi.string().valid(joi.ref("password")),
    code:joi.string().pattern(new RegExp(/^[0,9]{6}$/)),
id:joi.string().custom(isValidObjectId),
//dob:joi.date.less(now),
//gender:joi.string().valid(...Object.values(genderType)),
adresse:joi.string(),
//phone:joi.string.pattern(new RegExp(/^009|\+9)?01[0125][0-9]{8}$/))
}



