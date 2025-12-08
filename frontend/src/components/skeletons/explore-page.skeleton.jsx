export default function ExplorePageSkeleton() {
    return (
        <div className="py-24 container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col space-y-8">
                {/* Page Title */}
                <div className="space-y-2">
                    <div className="skeleton h-10 w-40"></div>
                    <div className="skeleton h-5 w-56"></div>
                </div>

                {/* Search Bar */}
                <div className="skeleton h-14 w-full rounded-lg"></div>

                {/* Tabs */}
                <div className="flex gap-2">
                    <div className="skeleton h-10 w-24 rounded-lg"></div>
                    <div className="skeleton h-10 w-24 rounded-lg"></div>
                </div>

                {/* Results header */}
                <div className="flex items-center justify-between">
                    <div className="skeleton h-6 w-40"></div>
                    <div className="skeleton h-6 w-20 rounded-full"></div>
                </div>

                {/* Posts list skeleton */}
                <div className="space-y-8">
                    {[1, 2, 3].map((i) => (
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
            </div>
        </div>
    );
}
