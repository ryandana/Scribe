const avatarUrl =
  "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80";

const thumbnail_url =
  "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=1506&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export const posts = [
  {
    _id: "679af1010bb12fa931001001",
    title: "How I Built My First Full-Stack App in One Weekend",
    body: "Building my first full-stack app taught me one thing: keep it simple. I used Next.js for the frontend, Express for the backend, and MongoDB for the database...",
    tags: ["Fullstack", "Next.js", "MongoDB"],
    thumbnail_url,
    readingTime: 6,
    author: {
      nickname: "Ryan Dana",
      username: "ryandana",
      avatar_url: avatarUrl,
    },
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2025-01-15T10:30:00Z",
  },
  {
    _id: "679af1010bb12fa931001002",
    title: "5 Mistakes Every Beginner React Developer Makes",
    body: "When I first started React, I made tons of mistakes. Here are the five biggest ones: forgetting keys, improper state structure, massive components...",
    tags: ["React", "Frontend"],
    thumbnail_url,
    readingTime: 4,
    author: {
      nickname: "John Doe",
      username: "johndoe",
      avatar_url: avatarUrl,
    },
    createdAt: "2025-02-02T09:00:00Z",
    updatedAt: "2025-02-02T09:00:00Z",
  },
  {
    _id: "679af1010bb12fa931001003",
    title: "Why Learning TypeScript Changed My Career",
    body: "Switching to TypeScript wasn't easy, but it completely changed the way I write code. It helped me scale projects faster and reduce bugs by 70%...",
    tags: ["TypeScript", "Developer"],
    thumbnail_url,
    readingTime: 7,
    author: {
      nickname: "Sarah Lee",
      username: "sarahl",
      avatar_url: avatarUrl,
    },
    createdAt: "2025-02-10T13:20:00Z",
    updatedAt: "2025-02-10T13:20:00Z",
  },
  {
    _id: "679af1010bb12fa931001004",
    title: "The Truth About Being a Self-Taught Developer",
    body: "People think being self-taught is easy because of free resources. The truth is: it's a long, lonely road unless you build consistency and community...",
    tags: ["Career", "Motivation"],
    thumbnail_url,
    readingTime: 5,
    author: {
      nickname: "Michael Chen",
      username: "michaelc",
      avatar_url: avatarUrl,
    },
    createdAt: "2025-03-01T08:45:00Z",
    updatedAt: "2025-03-01T08:45:00Z",
  },
  {
    _id: "679af1010bb12fa931001005",
    title: "How I Speed Up My API by 3x Using Caching",
    body: "Caching is one of the simplest ways to boost performance. I implemented Redis cache in my Express app and immediately saw huge improvements...",
    tags: ["Backend", "Performance"],
    thumbnail_url,
    readingTime: 8,
    author: {
      nickname: "Jane Smith",
      username: "janesmith",
      avatar_url: avatarUrl,
    },
    createdAt: "2025-03-05T11:10:00Z",
    updatedAt: "2025-03-05T11:10:00Z",
  },
  {
    _id: "679af1010bb12fa931001006",
    title: "Why You Should Use Prisma in Your Next Project",
    body: "Prisma made database work much more enjoyable for me. The auto-generated types, migration system, and clean API changed the way I build apps...",
    tags: ["Prisma", "Backend", "Database"],
    thumbnail_url,
    readingTime: 6,
    author: {
      nickname: "Kevin Hart",
      username: "kevinh",
      avatar_url: avatarUrl,
    },
    createdAt: "2025-03-12T14:00:00Z",
    updatedAt: "2025-03-12T14:00:00Z",
  },
];
