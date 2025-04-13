import { NextAuthConfig } from 'next-auth';
import Google from "next-auth/providers/google"

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const authConfig = {
    providers: [
        Google,
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false;

            const { data: userExists } = await supabase
                .from('users')
                .select('email')
                .eq('email', user.email)
                .single();

            return !!userExists;
        },
        async session({ session, token }) {
            if (session.user) {
                // session.user.id = token.sub as string;
                session.user.uuid = token.uuid as string;
                session.user.role = token.role as string;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                // token.id = user.id;

                const { data: userData } = await supabase
                    .from('users')
                    .select('id , roles(name)')
                    .eq('email', user.email)
                    .single();
                token.uuid = userData?.id;
                token.role = (userData?.roles as any)?.name || 'user';
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