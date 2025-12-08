import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const saveImage = async (buffer) => {
    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(UPLOAD_DIR, filename);

    // Compress and save
    await sharp(buffer).webp({ quality: 80 }).toFile(filepath);

    // Return relative path, let frontend handle the base URL
    const url = `uploads/${filename}`;

    return {
        url,
        public_id: filename,
    };
};

export const deleteImage = async (filename) => {
    if (!filename) return;
    try {
        const filepath = path.join(UPLOAD_DIR, filename);
        await fs.unlink(filepath);
    } catch (error) {
        console.error(`Failed to delete file ${filename}:`, error);
    }
};
