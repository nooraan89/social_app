import bcrypt from "bcrypt"
export const hash=({data,number})=>{
 return   bcrypt.hashSync(data,number)

}
export const compare =(data,hashdata)=>{

return bcrypt.compareSync(data,hashdata)

}