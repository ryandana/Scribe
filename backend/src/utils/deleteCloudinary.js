import cloudinary from "../config/cloudinary.js";

export const deleteCloudinary = async (publicId) => {
    if (!publicId) return;

    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (err) {
        console.error("Failed to delete Cloudinary image:", err.message);
    }
};
