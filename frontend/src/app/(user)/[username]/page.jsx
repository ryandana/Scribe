import Section from "@/components/atoms/section.component";
import api from "@/lib/api";
import { notFound } from "next/navigation";
import UserProfileHeader from "@/components/ui/user-profile-header.component";
import PostsList from "@/components/ui/posts-list.component";
import { IconArticle } from "@tabler/icons-react";

async function getUser(username) {
    try {
        const data = await api.get(`/api/users/${username}`);
        return data;
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
}

async function getUserPosts(username) {
    try {
        const data = await api.get(`/api/users/${username}/posts`);
        return data;
    } catch (error) {
        console.error("Error fetching user posts:", error);
        return { posts: [] };
    }
}

export default async function UserProfilePage({ params }) {
    const resolvedParams = await params;
    const username = resolvedParams.username;

    const user = await getUser(username);

    if (!user) {
        notFound();
    }

    const { posts } = await getUserPosts(username);

    return (
        <Section className="py-24">
            <div className="flex flex-col space-y-8">
                {/* User Profile Header */}
                <UserProfileHeader user={user} />

                {/* Divider */}
                <div className="divider"></div>

                {/* User Posts */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Posts by {user.nickname || user.username}</h2>
                        <span className="badge badge-neutral">{posts.length} posts</span>
                    </div>

                    {posts.length > 0 ? (
                        <PostsList posts={posts} />
                    ) : (
                        <div className="text-center py-12">
                            <IconArticle size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-500">No posts yet</h3>
                            <p className="text-gray-400">This user hasn't published any posts</p>
                        </div>
                    )}
                </div>
            </div>
        </Section>
    );
}
