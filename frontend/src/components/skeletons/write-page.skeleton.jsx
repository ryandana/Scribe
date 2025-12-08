export default function WritePageSkeleton() {
    return (
        <div className="py-24 container mx-auto px-4 md:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <div className="flex gap-2 mb-6">
                <div className="skeleton h-4 w-12"></div>
                <div className="skeleton h-4 w-4"></div>
                <div className="skeleton h-4 w-16"></div>
            </div>

            {/* Page header */}
            <div className="mb-8">
                <div className="skeleton h-10 w-48 mb-2"></div>
                <div className="skeleton h-5 w-64"></div>
            </div>

            <div className="space-y-6">
                {/* Thumbnail upload area */}
                <div className="skeleton w-full h-64 rounded-lg"></div>

                {/* Title input */}
                <div className="skeleton h-12 w-3/4"></div>

                {/* Short description input */}
                <div className="space-y-1">
                    <div className="skeleton h-16 w-full"></div>
                    <div className="skeleton h-3 w-24"></div>
                </div>

                {/* Tags input */}
                <div className="skeleton h-6 w-1/2"></div>

                {/* Editor and Preview grid */}
                <div className="grid md:grid-cols-2 gap-8 min-h-[500px]">
                    {/* Editor */}
                    <div className="space-y-3">
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-11/12"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-3/4"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-5/6"></div>
                    </div>

                    {/* Preview */}
                    <div className="border-l pl-8 hidden md:block space-y-4">
                        <div className="skeleton h-6 w-3/4"></div>
                        <div className="skeleton h-4 w-full"></div>
                        <div className="skeleton h-4 w-11/12"></div>
                        <div className="skeleton h-4 w-full"></div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between pt-8 border-t gap-6 md:flex-row flex-col">
                    <div className="skeleton h-12 w-full md:w-1/2 rounded-lg"></div>
                    <div className="skeleton h-12 w-full md:w-1/2 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}
