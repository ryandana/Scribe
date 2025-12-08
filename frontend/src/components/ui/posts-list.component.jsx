import Avatar from "@/components/ui/avatar.component";
import Link from "next/link";
import Image from "next/image";
import timeAgo from "@/lib/timeAgo";
import { getImageUrl } from "@/lib/imageUrl";

export default function PostsList({ posts }) {
  return (
    <>
      {posts.map((post) => {
        return (
          <Link
            href={`/post/${post._id}`}
            key={post._id}
            className="flex group justify-between rounded-lg md:gap-0 gap-x-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Avatar
                  src={getImageUrl(post.author.avatar_url)}
                  alt={post.author.nickname}
                  size={25}
                />
                <span className="text-sm">{post.author.nickname}</span>
              </div>
              <h2 className="md:text-2xl text-lg font-semibold group-hover:text-primary transition-all duration-100">
                {post.title}
              </h2>
              <p className="md:text-md text-sm md:block hidden max-w-2xl text-justify">
                {post.body}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm">
                  <span>{timeAgo(post.createdAt)}</span>
                  <span>·</span>
                  <span>{post.readingTime} Min Read</span>
                  <div className="badge badge-ghost group-hover:badge-neutral text-sm">
                    {post.tags[0]}
                  </div>
                </div>
                <div className="flex items-center">

                </div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-28 h-28 shrink-0 overflow-hidden rounded-lg">
                <Image
                  src={getImageUrl(post.thumbnail_url)}
                  alt={post.title}
                  width={112}
                  height={112}
                  unoptimized
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-all duration-100"
                />
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}
