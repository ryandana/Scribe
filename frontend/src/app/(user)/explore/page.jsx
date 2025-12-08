"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { IconSearch, IconUsers, IconArticle, IconAlertCircle } from "@tabler/icons-react";
import Section from "@/components/atoms/section.component";
import PostsList from "@/components/ui/posts-list.component";
import UserCard from "@/components/ui/user-card.component";
import api from "@/lib/api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PostsListSkeleton from "@/components/skeletons/posts-list.skeleton";
import UserListSkeleton from "@/components/skeletons/user-list.skeleton";
import ExplorePageSkeleton from "@/components/skeletons/explore-page.skeleton";

function ExplorePageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialSearch = searchParams.get("search") || "";
    const initialTab = searchParams.get("tab") || "posts";

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [activeTab, setActiveTab] = useState(initialTab);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    // Fetch posts
    const fetchPosts = useCallback(async (search = "") => {
        try {
            setIsLoading(true);
            setError(null);
            const query = search ? `?search=${encodeURIComponent(search)}` : "";
            const data = await api.get(`/api/posts${query}`);
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError(err.message || "Failed to fetch posts. Please try again.");
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Fetch users
    const fetchUsers = useCallback(async (search = "") => {
        if (!search.trim()) {
            setUsers([]);
            return;
        }
        try {
            setIsLoading(true);
            setError(null);
            const data = await api.get(`/api/users/search?search=${encodeURIComponent(search)}`);
            setUsers(data.users || []);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message || "Failed to fetch users. Please try again.");
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle search
    const handleSearch = useCallback(async () => {
        setHasSearched(true);

        // Update URL params
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
            params.set("search", searchTerm);
        } else {
            params.delete("search");
        }
        params.set("tab", activeTab);
        router.replace(`${pathname}?${params.toString()}`);

        if (activeTab === "posts") {
            await fetchPosts(searchTerm);
        } else {
            await fetchUsers(searchTerm);
        }
    }, [searchTerm, activeTab, fetchPosts, fetchUsers, searchParams, router, pathname]);

    // Debounced search effect
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, activeTab]);

    // Initial load
    useEffect(() => {
        if (activeTab === "posts") {
            fetchPosts(initialSearch);
        } else if (initialSearch) {
            fetchUsers(initialSearch);
        }
        if (initialSearch) {
            setHasSearched(true);
        }
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError(null);
    };

    return (
        <Section className="py-24">
            <div className="flex flex-col space-y-8">
                {/* Page Title */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Explore</h1>
                    <p className="text-gray-500">Discover posts and users</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full">
                    <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-400" size={22} />
                    <input
                        type="text"
                        className="input input-bordered input-lg w-full pl-12 bg-base-100 focus:input-primary transition-all"
                        placeholder={activeTab === "posts" ? "Search for posts..." : "Search for users..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed w-fit">
                    <button
                        className={`tab gap-2 ${activeTab === "posts" ? "tab-active" : ""}`}
                        onClick={() => handleTabChange("posts")}
                    >
                        <IconArticle size={18} />
                        Posts
                    </button>
                    <button
                        className={`tab gap-2 ${activeTab === "users" ? "tab-active" : ""}`}
                        onClick={() => handleTabChange("users")}
                    >
                        <IconUsers size={18} />
                        Users
                    </button>
                </div>

                {/* Error State */}
                {error && (
                    <div className="alert alert-error shadow-lg">
                        <IconAlertCircle size={24} />
                        <div>
                            <h3 className="font-bold">Error</h3>
                            <div className="text-sm">{error}</div>
                        </div>
                        <button className="btn btn-sm btn-ghost" onClick={handleSearch}>
                            Retry
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {isLoading && activeTab === "posts" && (
                    <PostsListSkeleton count={3} />
                )}
                {isLoading && activeTab === "users" && (
                    <UserListSkeleton count={3} />
                )}

                {/* Results */}
                {!isLoading && !error && (
                    <div className="flex flex-col space-y-6">
                        {activeTab === "posts" && (
                            <>
                                {posts.length > 0 ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold">
                                                {searchTerm ? `Results for "${searchTerm}"` : "All Posts"}
                                            </h2>
                                            <span className="badge badge-neutral">{posts.length} posts</span>
                                        </div>
                                        <PostsList posts={posts} />
                                    </>
                                ) : hasSearched ? (
                                    <div className="text-center py-12">
                                        <IconArticle size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-500">No posts found</h3>
                                        <p className="text-gray-400">Try a different search term</p>
                                    </div>
                                ) : null}
                            </>
                        )}

                        {activeTab === "users" && (
                            <>
                                {users.length > 0 ? (
                                    <>
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold">
                                                {searchTerm ? `Users matching "${searchTerm}"` : "Users"}
                                            </h2>
                                            <span className="badge badge-neutral">{users.length} users</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {users.map((user) => (
                                                <UserCard key={user._id} user={user} />
                                            ))}
                                        </div>
                                    </>
                                ) : hasSearched && searchTerm ? (
                                    <div className="text-center py-12">
                                        <IconUsers size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-500">No users found</h3>
                                        <p className="text-gray-400">Try a different search term</p>
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <IconUsers size={48} className="mx-auto text-gray-300 mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-500">Search for users</h3>
                                        <p className="text-gray-400">Enter a username or nickname to find people</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </Section>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={<ExplorePageSkeleton />}>
            <ExplorePageContent />
        </Suspense>
    );
}
