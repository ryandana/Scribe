import Image from "next/image";
import Link from "next/link";

export default function PostsLarge({ posts }) {
  return (
    <>
      {posts.slice(0, 2).map((post) => {
        return (
          <Link key={post._id} href={`/post/${post._id}`} className="rounded-lg bg-base-200">
            <div className="overflow-hidden rounded-lg">
              <Image
                src={post.thumbnail_url}
                alt={post.title}
                width={500}
                height={500}
                className="rounded-t-lg hover:scale-105 transition-all duration-100"
              />
            </div>
            <div className="p-4 flex flex-col gap-1">
              <h2 className="font-semibold text-lg">{post.title}</h2>
              <p className="text-sm">{post.body}</p>
              <p className="text-sm">{post.createdAt}</p>
            </div>
          </Link>
        );
      })}
    </>
  );
}
