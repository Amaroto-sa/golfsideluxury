import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware() {
        // Middleware logic if needed
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                // Protect all /admin routes except /admin/login
                if (req.nextUrl.pathname.startsWith("/admin/login")) {
                    return true;
                }
                if (req.nextUrl.pathname.startsWith("/admin")) {
                    return !!token;
                }
                return true;
            },
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
