export default function KPISkeleton() {
    return (
        <div className="bg-gray-50 rounded-xl p-4 shadow-sm animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full mb-3"></div>
            <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-8"></div>
            </div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
    );
}