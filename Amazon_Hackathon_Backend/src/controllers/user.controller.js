import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import {User} from "../models/User.model.js"
import {
    // DeleteOnCloudinary,
    UploadOnCloudinary
} from "../utils/Cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

// creating a method for generating access and refresh tokens for using in this file
const generateAccessAndRefreshToken = async (userId) => {
    try {
        // finding the user by its userId
        const user = await User.findById(userId);
        // generating both the tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        // setting the refresh token in user object(Database), which is coming from above constant
        user.refreshToken = refreshToken;
        // Saving the object but as we know monogoDB always validate all the feilds before saving then password also going to be validate therefore to stop that validation we will use ({validateBeforeSave: false})
        await user.save({validateBeforeSave: false});
        return {accessToken, refreshToken};
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler( async (req, res) => {
    // Take data from request body (get the user details from frontend )
    // validation - not empty
    // check if user already exists -> email, username
    // check for avata
    // upload avatar to clodinary
    // create user object -> create entry in database
    // remove password and refresh token feild from response 
    // check for user creation
    // return response

    const { username, email, password } = req.body;               // req.body is an object, possibly from a server response containing properties like username, email and password.
                                                                 // The { username, email, password } syntax pulls these specific properties out of req.body and assigns them directly to new variables with the same names.
                                                                // Now, username, email and password are individual constants containing the values from req.body.

    if(    // some is the method on array on which we can check any condition on each element of the array and according to the codition it will return true or false.
        [username, email, password].some((feild) => feild?.trim() === "")  // In the some() method this statement(feild?.trim() === "") means if feild is present then trim it then check if it is equals to "" => output will be boolean
    ){
        throw new ApiError(400, "All feilds are required")
    }
    // checking weather is user is existing or not
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    if(existedUser){
        throw new ApiError(409, "User with same Username or Email, already exists")
    }

    // uploading the avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Please upload an Avatar");
    }
    const avatar = await UploadOnCloudinary(avatarLocalPath);
    if(!avatar){
        throw new ApiError(400, "Avatar is required");
    }

    // creating the user on database
    const user = await User.create({
        username: username.toLowerCase(),
        avatar: avatar.url,
        email: email,
        password: password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    } else {
        console.log("The User is Created with the username :",user.username);
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

const loginUser = asyncHandler( async (req, res) => {
    // Take data from request body => All the feild for the login => username, password, email, refreshToken, accessToken
    // Find the user, weather the user exists or not
    // check the password, weather the password is correct or not
    // If the password is correct then generate the access and refresh token
    // send all these token in the form of cookies.
    // send the response that the user is logged in.
    
    const { email, username, password } = req.body;         // req.body means the current request u are sending to the server 
                                                            // in this case the console.log(req.body) will be 
                                                            // {
                                                            //   username: 'thunder_blood_9',
                                                            //   email: 'ayandragon9@gmail.com',
                                                            //   password: 'thunderblood@9'
                                                            // }    
                                                            // because this the data we are sending to the req.body which is getting displayed

    
    if(!(username || email)){
        throw new ApiError(400, "Username or Email is required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid){
        throw new ApiError(401, "Password is incorrect")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        // secure: true       // by adding this we are not getting cookies therefore we are commenting it
    } 

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged in Successfully!!!"
        )
    )
    
})

const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined       // this removes the field from document basically we are setting(updating) the value
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        // secure: true       // by adding this we are not getting cookies therefore we are commenting it
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler( async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if(!incomingRefreshToken){
            throw new ApiError(401, "Don't get the incoming refresh token")
        }

        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id);
        if(!user){
            throw new ApiError(401, "Dont get the User because of invalid refresh token")
        }

        if(incomingRefreshToken !== decodedToken){
            throw new ApiError("Refresh Token is expired")
        }

        const options = {
            httpOnly: true,
        }

        const {accessToken, newRefreshToken} = await generateAccessAndRefreshToken(user._id);

        return res
        .status(200)
        .cookie("AccessToken", accessToken, options)
        .cookie("RefreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, newRefreshToken},
                "User Access Token Refreshed Successfully!!!"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }
})

const changeCurrentPassword = asyncHandler( async (req, res) => {
    const {oldPassword, newPassword} = req.body;

    const user = User.findById(req.user?._id);
    if(!user){
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);
    if(!isPasswordCorrect){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave:true})

    return res
    .status(200)
    .json(
        new ApiResponse(200, {}, "Password Changed Successfully")
    )
})

const getCurrentUser = asyncHandler( async (req, res) => {
    return res
    .status(200)
    .json(
        new ApiResponse(200, req.user, "Current user fetched successfully")
    )
})

const updateAccountDetials = asyncHandler( async (req, res) => {
    const {username, email} = req.body;
    if(!username || !email){
        throw new ApiError(400, "All feilds are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                username,
                email
            }
        },
        { new: true }
    ).select("-password");

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "Account details updated Successfully")
    )
})
 
const updateUserAvatar = asyncHandler( async (req,res) => {
    const avatarLocalPath = req.files?.avatar[0]?.path;
    if(!avatarLocalPath){
        throw new ApiError(400, "Invalid provided path of the avatar")
    }

    const avatar = await UploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploading the avatar")
    }

    // const deleteOldAvatar = await DeleteOnCloudinary(avatarLocalPath);
    // if(!deleteOldAvatar){
    //     throw new ApiError(500, "The old avatar is not deleted yet!!!")
    // }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar: avatar.url
            }
        },
        { new : true }
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiResponse(200, user, "User Avatar updated Successfully")
    )
})


export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetials,
    updateUserAvatar
};