import NextAuth from "next-auth";
import { config as authConfig } from "@/auth";

export default NextAuth(authConfig).auth;

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
