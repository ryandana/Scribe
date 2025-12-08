export default function ProfileFormSkeleton() {
    return (
        <div className="space-y-6">
            {/* Title */}
            <div className="skeleton h-8 w-40"></div>

            {/* Form fields */}
            <div className="space-y-4">
                {/* Username, Email, Nickname */}
                {[1, 2, 3].map((i) => (
                    <div key={i} className="form-control w-full">
                        <div className="skeleton h-4 w-20 mb-2"></div>
                        <div className="skeleton h-12 w-full rounded-lg"></div>
                    </div>
                ))}

                {/* Bio field - taller */}
                <div className="form-control w-full">
                    <div className="flex justify-between mb-2">
                        <div className="skeleton h-4 w-12"></div>
                        <div className="skeleton h-4 w-16"></div>
                    </div>
                    <div className="skeleton h-32 w-full rounded-lg"></div>
                    <div className="skeleton h-3 w-64 mt-2"></div>
                </div>

                {/* Submit button */}
                <div className="skeleton h-12 w-full rounded-lg mt-4"></div>
            </div>
        </div>
    );
}
