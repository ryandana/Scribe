import Section from "@/components/atoms/section.component";
import PostsLarge from "@/components/ui/posts-large.component";
import PostsList from "@/components/ui/posts-list.component";
import UserRecommendationCard from "@/components/ui/user-recommendation-card.component";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

import api from "@/lib/api";

const getPosts = async () => {
  try {
    const data = await api.get(`/api/posts`);
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [] };
  }
};

export default async function Page() {
  const { posts } = await getPosts();

  return (
    <Section className="py-24">
      <div className="flex w-full md:flex-row flex-col space-x-10 md:space-y-0 space-y-8 relative">
        <div className="flex flex-col md:space-y-6 space-y-8 md:w-2/3 w-full">
          {/* Latest Posts Header */}
          <div className="flex w-full items-center justify-between">
            <h2 className="mb-3 text-3xl font-bold">Latest Posts</h2>
            <Link
              href="/explore"
              className="flex items-center text-sm font-bold gap-1"
            >
              See All
              <IconArrowRight size={16} />
            </Link>
          </div>
          {/* Latest Posts */}
          <PostsList posts={posts} />
        </div>
        <div className="md:sticky md:top-24 md:w-1/3 w-full flex flex-col space-y-6 h-fit">
          {/* User Recommendations */}
          <UserRecommendationCard limit={5} />

          {/* Popular Posts Header */}
          <div className="flex w-full">
            <h2 className="mb-3 text-3xl font-bold">Popular Posts</h2>
          </div>
          {/* Popular Posts */}
          <PostsLarge posts={posts} />
        </div>
      </div>
    </Section>
  );
}
