import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-6">
            <div className="text-center space-y-6 max-w-md">
                <h1 className="text-8xl font-serif text-primary font-bold">404</h1>
                <h2 className="text-2xl font-serif text-white">Page Not Found</h2>
                <p className="text-muted-foreground">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
