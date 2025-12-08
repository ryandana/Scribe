import timeAgo from "@/lib/timeAgo";
import Image from "next/image";
import Link from "next/link";
import Avatar from "@/components/ui/avatar.component";
import { getImageUrl } from "@/lib/imageUrl";
import { IconEye } from "@tabler/icons-react";
import VoteControl from "./vote-control.component";

export default function PostsLarge({ posts }) {
  return (
    <>
      {posts.slice(0, 2).map((post) => {
        return (
          <Link key={post._id} href={`/post/${post._id}`} className="group">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={getImageUrl(post.thumbnail_url)}
                alt={post.title}
                width={500}
                height={500}
                unoptimized
                className="rounded-t-lg group-hover:scale-105 transition-all duration-100"
              />
            </div>
            <div className="py-4 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Avatar src={getImageUrl(post.author.avatar_url)} alt={post.author.nickname} size={25} />
                <p className="text-sm">{post.author.nickname}</p>
              </div>
              <h2 className="font-semibold text-2xl group-hover:text-primary transition-all duration-100">{post.title}</h2>
              <p className="text-sm">{post.body}</p>
              <div className="flex items-center gap-2 text-sm">
                <span>{timeAgo(post.createdAt)}</span>
                <span>·</span>
                <span>{post.readingTime} Min Read</span>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <IconEye size={16} />
                  <span>{post.views || 0}</span>
                </div>
                <div className="badge badge-ghost group-hover:badge-neutral text-sm">
                  {post.tags[0]}
                </div>
                <span>·</span>
                <VoteControl post={post} />
              </div>
            </div>
          </Link>
        );
      })}
    </>
  );
}
