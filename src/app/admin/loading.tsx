export default function AdminLoading() {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-4">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
                <p className="text-muted-foreground text-sm">Loading dashboard...</p>
            </div>
        </div>
    );
}
