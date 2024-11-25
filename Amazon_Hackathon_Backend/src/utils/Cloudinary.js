import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


const UploadOnCloudinary = async (localFilePath) => {
    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,  {
            resource_type:"auto"
        })
        // console.log("file is uploaded on cloudinary successfully", response.url);
        fs.unlinkSync(localFilePath)
        return response;
    } catch(error){
        fs.unlinkSync(localFilePath)  // remove the locally saved temporary file as the upload option got failed
        console.log("Error While Uploading the File on Cloudinary,",error)
        return null;
    }
}
// const DeleteOnCloudinary = async (localFilePath) => {
//     // Configuration
//     cloudinary.config({
//         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET 
//     });

//     try {
//         if(!localFilePath) return null
//         // delete the file on cloudinary
//         const response = await cloudinary.uploader.destroy(localFilePath,  {
//             resource_type:"auto"
//         })
//         return response;
//     } catch(error){
//         console.log("Error While Uploading the File on Cloudinary,",error)
//         return null;
//     }
// }

export {
    UploadOnCloudinary,
    // DeleteOnCloudinary
};