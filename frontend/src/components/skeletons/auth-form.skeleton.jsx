export default function AuthFormSkeleton() {
    return (
        <div className="flex md:flex-row-reverse flex-col pt-24 w-full">
            {/* Image placeholder */}
            <div className="min-h-[400px] md:min-h-full w-full md:w-1/2 md:block hidden relative">
                <div className="skeleton w-full h-full rounded-lg"></div>
            </div>

            {/* Form skeleton */}
            <div className="flex flex-col w-full md:w-1/2 items-center justify-center md:py-0 py-8">
                {/* Title */}
                <div className="skeleton h-8 w-64 mb-8 md:mb-12"></div>

                <div className="w-full max-w-md px-4 md:px-0 space-y-5">
                    {/* Input fields */}
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="skeleton h-4 w-20"></div>
                            <div className="skeleton h-12 w-full rounded-lg"></div>
                        </div>
                    ))}

                    {/* Submit button */}
                    <div className="skeleton h-12 w-full rounded-lg"></div>

                    {/* Link */}
                    <div className="skeleton h-4 w-40 mx-auto"></div>
                </div>
            </div>
        </div>
    );
}
