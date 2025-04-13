import { auth } from "@/lib/auth"
import Providers from "@/components/layout/providers"
import { Toaster } from "@/components/ui/sonner"
import type { Metadata } from "next"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import { Prompt } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
import "./globals.css"
import { TRPCProvider } from "@/utils/trpc-provider"

export const metadata: Metadata = {
    title: "Next Shadcn",
}

const prompt = Prompt({
    subsets: ["latin"],
    weight: ["400", "700", "900"],
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const session = await auth()
    return (
        <html lang="en" className={`${prompt.className}`} suppressHydrationWarning>
            <body className={"overflow-hidden"}>
                <NextTopLoader showSpinner={false} />
                <NuqsAdapter>
                    <Providers session={session}>
                        <TRPCProvider>
                            <Toaster />
                            {children}
                        </TRPCProvider>
                    </Providers>
                </NuqsAdapter>
            </body>
        </html>
    )
}
