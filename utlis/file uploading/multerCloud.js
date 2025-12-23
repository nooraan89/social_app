import { diskStorage } from "multer";
import multer from "multer";
export const uploadCloud=()=>{
    
    const storage=diskStorage({ });
 const multerupload=multer({storage});
 return multerupload;
}
