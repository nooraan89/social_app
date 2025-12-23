import jwt from "jsonwebtoken";
export const token=({data,secretkey,options={}})=>{
 return  jwt.sign(data,secretkey,options)}
 export const verifyToken=({data,secretkey,options={}})=>{
    return jwt.verify(data,secretkey,options)}