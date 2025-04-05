import { NextAuthConfig } from 'next-auth';
import Google from "next-auth/providers/google"

const authConfig = {
    providers: [
        Google,
    ],
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.sub as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        }
    },
    pages: {
        signIn: '/'
    },
    session: {
        strategy: "jwt"
    },
    debug: process.env.NODE_ENV === 'development',
} satisfies NextAuthConfig;

export default authConfig;