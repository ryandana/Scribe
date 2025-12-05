import Section from "@/components/atoms/section.component";
import PostsLarge from "@/components/ui/posts-large.component";
import PostsList from "@/components/ui/posts-list.component";
import { posts } from "@/constants/libMockPosts";
import { IconArrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function Page() {
  return (
    <Section className="py-24">
      <div className="flex w-full md:flex-row flex-col space-x-6 relative">
        <div className="flex flex-col space-y-6 md:w-3/4 w-full">
          <div className="flex w-full items-center justify-between">
            <h1 className="mb-3 text-lg font-semibold">Latest Posts</h1>
            <Link
              href="/explore"
              className="flex items-center font-semibold gap-1"
            >
              See All
              <IconArrowRight />
            </Link>
          </div>
          <PostsList posts={posts} />
        </div>
        <div className="md:sticky md:w-1/4 w-full flex flex-col space-y-3">
          <PostsLarge posts={posts} />
        </div>
      </div>
    </Section>
  );
}
