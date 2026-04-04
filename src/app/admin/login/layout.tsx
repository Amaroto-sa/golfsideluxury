import React from "react";

// Login page has its own minimal layout — NO auth check
export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
