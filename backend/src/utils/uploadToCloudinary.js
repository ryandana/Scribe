import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "medium_clone_posts",
                resource_type: "image",
            },
            (error, result) => {
                if (error) reject(error);
                else
                    resolve({
                        url: result.secure_url,
                        public_id: result.public_id,
                    });
            }
        );
        stream.end(buffer);
    });
};
