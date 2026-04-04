"use client";

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[60vh] flex items-center justify-center px-6">
            <div className="text-center space-y-6 max-w-md">
                <h2 className="text-3xl font-serif text-primary">Something went wrong</h2>
                <p className="text-muted-foreground">
                    We encountered an error loading this page. Please try again.
                </p>
                <button
                    onClick={reset}
                    className="bg-primary text-primary-foreground px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
}
