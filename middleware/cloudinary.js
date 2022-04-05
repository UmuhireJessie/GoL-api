import cloudinary from "cloudinary";
import dotenv from  "dotenv";

dotenv.config();


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_USER_NAME,
  api_key: process.env.CLOUDINARY_API_key,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;