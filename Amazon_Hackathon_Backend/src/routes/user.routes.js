import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, updateUserAvatar} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// whenever u set a middleware then just put the middleware first then put the actual function which u want to send user to like i did below and always remember that the middleware must have next() at the end.
router.route("/register").post(
    // this upload.feilds is middleware here.
    upload.fields([
        {
            name:"avatar",
            maxCount: 1
        }
    ]),
    registerUser
    );

router.route("/login").post(loginUser);
// whenever u set a middleware then just put the middleware first then put the actual function which u want to send user to like i did below.
// u can set as much middleware as u want like this => .post(verifyJWT,secondMiddleware,thirdMiddleware,andSoOnMiddleware,logoutUser)
router.route("/logout").post(verifyJWT,logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/update-avatar").post(updateUserAvatar);

export default router;