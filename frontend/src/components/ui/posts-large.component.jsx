import Image from "next/image";
import Link from "next/link";

export default function PostsLarge({ posts }) {
  return (
    <>
      {posts.slice(0, 2).map((post) => {
        return (
          <Link key={post._id} href={`/feed/${post._id}`}>
            <div>
              <Image
                src={post.thumbnail_url}
                alt={post.title}
                width={500}
                height={500}
              />
            </div>
          </Link>
        );
      })}
    </>
  );
}
