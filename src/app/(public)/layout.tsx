import React from "react";

/**
 * Next.js layout for the (public) route group.
 * This must be a simple server component that just renders children.
 * All navigation/footer UI lives in PublicShell (via template.tsx).
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
