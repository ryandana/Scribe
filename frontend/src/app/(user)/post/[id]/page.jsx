import api from "@/lib/api";
import { redirect, notFound } from "next/navigation";

async function getPost(id) {
    try {
        const data = await api.get(`/api/posts/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching post:", error);
        return null;
    }
}

export default async function Page({ params }) {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const post = await getPost(id);

    if (!post) {
        notFound();
    }

    // Redirect to the new URL pattern: /{username}/{postId}
    redirect(`/${post.author.username}/${post._id}`);
}
