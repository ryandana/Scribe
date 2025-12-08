export default function UserListSkeleton({ count = 3 }) {
    return (
        <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className="flex items-center gap-4 p-4 rounded-lg border border-base-200"
                >
                    {/* Avatar */}
                    <div className="skeleton w-14 h-14 rounded-full shrink-0"></div>

                    {/* User info */}
                    <div className="flex-1 space-y-2">
                        <div className="skeleton h-5 w-32"></div>
                        <div className="skeleton h-4 w-24"></div>
                        <div className="skeleton h-3 w-48 hidden sm:block"></div>
                    </div>

                    {/* Follow button */}
                    <div className="skeleton h-8 w-24 rounded-lg shrink-0"></div>
                </div>
            ))}
        </div>
    );
}
