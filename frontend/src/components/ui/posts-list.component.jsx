import Avatar from "@/components/ui/avatar.component";
import Link from "next/link";
import Image from "next/image";
import timeAgo from "@/lib/timeAgo";
import { getImageUrl } from "@/lib/imageUrl";
import { IconEye } from "@tabler/icons-react";
import VoteControl from "./vote-control.component";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import previewText from "@/utils/previewText";

export default function PostsList({ posts }) {
  return (
    <>
      {posts.map((post) => {
        const postUrl = post.author?.username
          ? `/${post.author.username}/${post._id}`
          : `/post/${post._id}`;

        return (
          <Link
            href={postUrl}
            key={post._id}
            className="flex group justify-between rounded-lg md:gap-0 gap-x-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <Avatar
                    src={getImageUrl(post.author?.avatar_url)}
                    alt={post.author?.nickname || 'Author'}
                    size={25}
                  />
                  <span className="text-sm hover:underline">{post.author?.nickname || 'Unknown'}</span>
                </div>
              </div>
              <h2 className="md:text-2xl text-xl font-semibold group-hover:text-primary transition-all duration-100">
                {post.title}
              </h2>
              <div className="prose prose-sm md:block hidden">
                <ReactMarkdown remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}>
                  {previewText(post.body)}
                </ReactMarkdown>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 md:text-sm text-xs">
                  <span>{timeAgo(post.createdAt)}</span>
                  <span>·</span>
                  <span>{post.readingTime} Min Read</span>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <IconEye size={16} />
                    <span>{post.views || 0}</span>
                  </div>
                  <div className="badge badge-ghost group-hover:badge-neutral font-medium md:text-sm text-xs">
                    #{post.tags[0]}
                  </div>
                </div>
              </div>
              <div>
                <VoteControl post={post} />
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
          </Link >
        );
      })}
    </>
  );
}
