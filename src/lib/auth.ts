import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (credentials) => {
                const { email, password } = credentials;
                if (!email || !password) {
                    throw new Error("Email and Password required");
                }
                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email });

                    if (!user || !user.password) {
                        throw new Error("User not found or password missing");
                    }

                    const isValidPassword = await bcrypt.compare(
                        password as string,
                        user.password
                    );

                    if (!isValidPassword) {
                        throw new Error("Invalid password");
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                    };
                } catch (error) {
                    console.error("Login error:", error);
                    throw new Error("Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        signOut: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
});
