
import  jwt from "jsonwebtoken";
import UserModel from "../DB/models/user.model.js"
import { asyncHandler } from "../../utlis/error_handling/asyncHandler.js";
import {verifyToken} from "../../utlis/token/token.js";

export const rolestype={admin:"admin",user:"user"}
const tokenTypes={access:"access",refresh:"refresh"}


export const authentication =()=>{return async(req,res,next)=>{
    try{
    const {authorization}=req.headers;
    if(!authorization)
        return next(new Error("authorize token is required",{cause:401}))
    req.user = await decodedToken(authorization,next)  ;
    console.log(req.user);
    return  next();

}
    catch(error){next(error)}}}


export const allowTo=((roles=[])=>{
return (req,res,next)=>{

if(!roles.includes(req.user.role))
    return next(new Error("forbidden account",{cause:400}));
return next();

}

});
export const decodedToken = async (authorization = "", tokenType = tokenTypes.access, next = {}) => {
    // Ensure the `authorization` value is a string
    if (typeof authorization !== "string") {
        return next(new Error("Invalid authorization format", { cause: 400 }));
    }

    // Split the `authorization` header into `bearer` and `token`
    const [bearer, token] = authorization.split(" ");
    if (!bearer || !token) {
        return next(new Error("Invalid authorization structure", { cause: 401 }));
    }
console.log(bearer,token)
    // Define secret keys based on the type of bearer (user or admin)
    let secretkey_access, secretkey_refresh;
    if(bearer === rolestype.user) {
        secretkey_access = process.env.TOKEN_ACCESS_USER;
        secretkey_refresh = process.env.TOKEN_REFRESH_USER;
    } else {
        secretkey_access = process.env.TOKEN_ACCESS_ADMIN;
        secretkey_refresh = process.env.TOKEN_REFRESH_ADMIN;
    }

    
        // Verify the token with the appropriate secret key
        const decoded = jwt.verify(
            token,
             tokenTypes.access?secretkey_access:secretkey_refresh
        );
console.log(decoded)
        // Fetch user information using the decoded token's ID
        const user = await UserModel.findById(decoded._id);
        if (!user) return next(new Error("User not found", { cause: 404 }));
        
        // Check if the user's `changedAt` field is newer than the token's issued time
        if (user.changedAt?.getTime() >= decoded.iat * 1000) {
            return next(new Error("Please log in again", { cause: 401 }));
        }
        
        // Check if the user account is marked as deleted
        if (user.isDeleted) {
            return next(new Error("Please log in again", { cause: 400 }));
        }
        // Return the validated user
        return user;

};