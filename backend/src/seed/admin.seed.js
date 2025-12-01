import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

export const seedSuperAdmin = async () => {
    const exist = await User.findOne({ role: "admin" });
    if (exist) {
        console.log("Super admin already seeded");
        return;
    }

    const hashed = await bcrypt.hash("AdminSMK2025", 12);

    await User.create({
        username: "ryandana",
        nickname: "ryandana",
        email: "admin@smktibaliglobalbadung.sch.id",
        password: hashed,
        role: "admin",
        nis: null,
        classId: null,
    });

    console.log("Super admin seeded ✅");
};
