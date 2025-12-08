"use client";

import { useState } from "react";
import Button from "@/components/ui/button.component";
import api from "@/lib/api";
import { useAuth } from "@/context/auth.context";
import { useRouter } from "next/navigation";

export default function SecurityTab() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: "", content: "" });
    const { logout } = useAuth();
    const router = useRouter();

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: "", content: "" });

        try {
            await api.put("/api/auth/me", { password });
            setMsg({ type: "success", content: "Password updated successfully" });
            setPassword("");
        } catch (err) {
            setMsg({
                type: "error",
                content: err?.data?.message || err.message || "Failed to update password",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (
            !confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        )
            return;

        try {
            await api.delete("/api/auth/me");
            await logout();
            router.push("/");
        } catch (err) {
            alert("Failed to delete account");
        }
    };

    return (
        <div className="space-y-8">
            {msg.content && (
                <div
                    className={`alert ${msg.type === "success" ? "alert-success" : "alert-error"
                        } text-sm`}
                >
                    {msg.content}
                </div>
            )}

            {/* Change Password */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold">Change Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">New Password</span>
                        </label>
                        <input
                            type="password"
                            placeholder="Enter new password"
                            className="input input-bordered w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="8"
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading || !password}>
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </form>
            </div>

            <div className="divider"></div>

            {/* Delete Account */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-error">Danger Zone</h3>
                <p className="text-sm text-base-content/70">
                    Once you delete your account, there is no going back. Please be
                    certain.
                </p>
                <button
                    onClick={handleDeleteAccount}
                    className="btn btn-error btn-outline"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}
