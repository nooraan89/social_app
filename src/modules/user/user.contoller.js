import { Router} from "express";
import * as userservice from "./user.service.js"
import { authentication } from "../../middlewares/auth.middellwer.js";
import { asyncHandler } from "../../../utlis/error_handling/asyncHandler.js";
import { validation } from "../../middlewares/validation.middlewares.js";
import { shareprofileSchema, updatEmailSchema ,resetEmailSchema,updatePasswordSchema,updateProfileSchema, friendRequestSchema, acceptFriendRequestSchema} from "./user.validation.js";
import {fileValidation, upload}from "../../../utlis/file uploading/multerUploading.js";
import { uploadCloud } from "../../../utlis/file uploading/multerCloud.js";

const router=Router();
router.get("/profile",
    authentication(),
    asyncHandler(userservice.getprofile));
router.get("/profile/:profileId",
    validation(shareprofileSchema),
authentication(),
asyncHandler(userservice.shareprofile));
router.patch("/updateemail",
    validation(updatEmailSchema),
    authentication(),
    asyncHandler(userservice.updateEmail));
    router.patch("/resetemail",
        authentication()
      ,userservice.reset_email);
    router.patch("/updatPassword",
        validation(updatePasswordSchema),
        authentication(),
        asyncHandler(userservice.update_password)
        )
        router.patch("/updateProfile",
            validation(updateProfileSchema),
            authentication(),

            asyncHandler(userservice.updateProfile)
        )
        router.post("/profilePicture",
            authentication(),
          upload(fileValidation.images,"uploads/user").single("image"),
            asyncHandler(userservice.profilePicture)
        )
        router.post("/uploadmultipleimage",
            authentication(),
           upload(fileValidation.images,"uploads/user").array("images",3),
            asyncHandler(userservice.coverImages)
        )
        router.delete("/deleteprofileimage",
            authentication(),
            upload(fileValidation.images,"upload/user").single("image"),
            
            asyncHandler(userservice.deleteProfileImage)
        )
        router.post("/uploadimageoncloud",
            authentication()
            ,uploadCloud().single("image"),asyncHandler(userservice.uploadImageOnCloud))
            /////////////////////////////////////////////////////////
            router.post("/friend_request/:friendId",
                authentication(),
               validation(friendRequestSchema),
                asyncHandler(userservice.friendRequest)
            )
            /////////////////////////////////////////////////////////////
 router.post("/friend_request/:friendId/accept",
                authentication(),
               validation(acceptFriendRequestSchema),
                asyncHandler(userservice.acceptFriendRequest)
            )


        
export default router;