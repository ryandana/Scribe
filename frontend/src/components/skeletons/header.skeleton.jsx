export default function HeaderSkeleton() {
    return (
        <div className="navbar mx-auto container px-4 md:px-6 lg:px-8">
            {/* Logo placeholder */}
            <div className="navbar-start">
                <div className="skeleton h-6 w-16"></div>
            </div>

            {/* Desktop Menu placeholder */}
            <div className="navbar-center md:flex hidden gap-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="skeleton h-8 w-16 rounded-lg"></div>
                ))}
            </div>

            {/* Auth section placeholder */}
            <div className="navbar-end space-x-3 md:flex hidden">
                <div className="skeleton w-10 h-10 rounded-full"></div>
                <div className="skeleton h-10 w-20 rounded-lg"></div>
            </div>

            {/* Mobile menu button placeholder */}
            <div className="navbar-end md:hidden">
                <div className="skeleton w-8 h-8 rounded"></div>
            </div>
        </div>
    );
}
