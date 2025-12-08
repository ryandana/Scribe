export default function ProfileLayoutSkeleton() {
    return (
        <div className="py-24 mx-auto max-w-5xl px-4">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Skeleton */}
                <div className="w-full md:w-1/4 flex flex-col gap-6">
                    {/* User Info Card */}
                    <div className="card bg-base-100 border border-base-200 p-6 flex flex-col items-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                            <div className="skeleton w-24 h-24 rounded-full"></div>
                            <div className="skeleton absolute bottom-0 right-0 w-8 h-8 rounded-full"></div>
                        </div>
                        {/* Name */}
                        <div className="skeleton h-6 w-32 mb-2"></div>
                        {/* Username */}
                        <div className="skeleton h-4 w-24 mb-2"></div>
                        {/* Bio */}
                        <div className="skeleton h-12 w-full mb-3"></div>
                        {/* Stats */}
                        <div className="flex gap-4">
                            <div className="text-center space-y-1">
                                <div className="skeleton h-5 w-8 mx-auto"></div>
                                <div className="skeleton h-3 w-16"></div>
                            </div>
                            <div className="text-center space-y-1">
                                <div className="skeleton h-5 w-8 mx-auto"></div>
                                <div className="skeleton h-3 w-16"></div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="menu bg-base-100 w-full rounded-box border border-base-200 p-2 space-y-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="skeleton h-10 w-full rounded-lg"></div>
                        ))}
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="flex-1">
                    <div className="card bg-base-100 border border-base-200 p-6">
                        <div className="space-y-6">
                            <div className="skeleton h-8 w-48"></div>
                            <div className="space-y-4">
                                <div className="skeleton h-12 w-full"></div>
                                <div className="skeleton h-12 w-full"></div>
                                <div className="skeleton h-12 w-full"></div>
                                <div className="skeleton h-12 w-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
