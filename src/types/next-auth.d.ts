import type { NextAuth } from 'next-auth';

declare module "next-auth" {
    interface Session {
        user: {
            uuid: string
            email: string
            role: string
            image: string
            name: string
        }
    }
}