export default function PostsListSkeleton({ count = 3 }) {
    return (
        <div className="space-y-8">
            {[...Array(count)].map((_, i) => (
                <div key={i} className="flex justify-between gap-6">
                    <div className="space-y-3 w-full">
                        {/* Author Info */}
                        <div className="flex items-center gap-2">
                            <div className="skeleton w-6 h-6 rounded-full"></div>
                            <div className="skeleton h-4 w-24"></div>
                        </div>
                        {/* Title */}
                        <div className="skeleton h-8 w-3/4"></div>
                        {/* Body Preview */}
                        <div className="space-y-2 hidden md:block">
                            <div className="skeleton h-4 w-full"></div>
                            <div className="skeleton h-4 w-5/6"></div>
                        </div>
                        {/* Meta Info */}
                        <div className="flex gap-2">
                            <div className="skeleton h-4 w-12"></div>
                            <div className="skeleton h-4 w-12"></div>
                            <div className="skeleton h-4 w-12"></div>
                        </div>
                    </div>
                    {/* Thumbnail */}
                    <div className="w-28 h-28 shrink-0">
                        <div className="skeleton w-full h-full rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
