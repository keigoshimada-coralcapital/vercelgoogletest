import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/lib/types";

// Simple RBAC Logic
// In a real app, this might come from a DB or external IAM
const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];
const EDITOR_EMAILS = process.env.EDITOR_EMAILS?.split(",") || [];

function getRole(email: string | null | undefined): UserRole {
    if (!email) return "viewer";
    if (ADMIN_EMAILS.includes(email)) return "admin";
    if (EDITOR_EMAILS.includes(email)) return "editor";
    return "viewer"; // Default role
}

export const config = {
    theme: {
        logo: "https://next-auth.js.org/img/logo/logo-sm.png", // Replace with Coral logo in production
    },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            // 1. Restrict to @coralcap.co domain
            if (user.email && user.email.endsWith("@coralcap.co")) {
                return true;
            }
            return false; // Deny access
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.role = getRole(user.email);
            }
            return token;
        },
        async session({ session, token }) {
            // Pass role from token to session
            if (session.user && token.role) {
                (session.user as any).role = token.role as UserRole;
            }
            return session;
        },
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/");

            // Allow access to public assets and login page
            if (nextUrl.pathname.startsWith("/_next") ||
                nextUrl.pathname.startsWith("/api/auth") ||
                nextUrl.pathname === "/login") {
                return true;
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
    },
    pages: {
        signIn: "/login",
    },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
