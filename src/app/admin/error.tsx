"use client";

export default function AdminErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-6 max-w-md">
                <h2 className="text-2xl font-serif text-primary">Dashboard Error</h2>
                <p className="text-muted-foreground text-sm">
                    An error occurred loading this section. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="bg-primary text-primary-foreground px-5 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
