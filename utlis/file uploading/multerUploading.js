import { diskStorage } from "multer";
import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs"
export const fileValidation={
images:["image/png","image/jpg","imagr/jpeg"],
files:["application/pdf"],
videos:["vidro/mp4"],
audios:["audeo/mpeg"]


}
export const upload=(filetype,folder)=>{
    
    const storage=diskStorage({
  destination:(req,file,cb)=>{
const folderpath=path.resolve(".",`${folder}/${req.user._id}`)
if(fs.existsSync(folderpath))
  return cb(null,folderpath)
else
{
fs.mkdirSync(folderpath,{recursive:true});
const filename=`$folder/${req.user._id}`;
cb(null,filename);

}



  },
  filename:(req,file,cb)=>{
cb(null,nanoid()+"_________"+file.originalname)  }

    });
    const fileFilter=(req,file,cb)=>{
if(file.mimtype!=="image/png")

return  cb(new Error("in_valid file type"),false);
return cb (null,true);

    };
 const multerupload=multer({storage,fileFilter});
 return multerupload;
}
