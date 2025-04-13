"use client"

import { trpc } from "@/utils/trpc"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { CreateSheet } from "@/components/create-sheet"
import { formatDateUTC8 } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export default function SignUpBossPage() {
    const queryClient = useQueryClient()
    const { data: sheets, isLoading, refetch } = trpc.nightCrows.getSignupBoss.useQuery()
    const { data: session, status } = useSession()
    const getAccountGame = trpc.nightCrows.getAccountGame.useQuery(
        {
            uuid: session?.user?.uuid || "",
            game: "nightcrows",
        },
        {
            enabled: !!session?.user?.uuid,
        }
    )

    const updateSignup = trpc.nightCrows.updateSignupBoss.useMutation({
        onSuccess: () => {
            toast.success("Signed up successfully")
            refetch()
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleSignUp = async (sheetId: number) => {
        try {
            await updateSignup.mutateAsync({
                id: sheetId,
                username: getAccountGame.data?.character_name,
            })
        } catch (error) {
            console.error("Error signing up:", error)
        }
    }

    useEffect(() => {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

        const subscription = supabase
            .channel("sign_up_boss_changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "sign_up_boss",
                },
                async (payload) => {
                    console.log("Received change:", payload)
                    await refetch() // Directly refetch data
                    await queryClient.invalidateQueries({
                        queryKey: [["nightCrows", "getSignupBoss"]],
                    })
                }
            )
            .subscribe((status) => {
                console.log("Subscription status:", status)
            })

        return () => {
            supabase.removeChannel(subscription)
        }
    }, [queryClient, refetch])

    return (
        <div className="h-[calc(100vh-4rem)] w-full overflow-y-auto p-2 sm:p-5">
            <div className="flex justify-between">
                <div className="order-last">
                    <CreateSheet />
                </div>
                <div className="order-first content-center">
                    <h2>Sign up boss</h2>
                </div>
            </div>
            <div className="pt-5 grid grid-col-1 gap-6">
                {sheets?.map((sheet) => {
                    return (
                        <Card key={sheet.id}>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex justify-between">
                                        <div className="order-first content-center">
                                            {sheet.boss} - {formatDateUTC8(sheet.created_at)}
                                        </div>
                                        <div className="order-last grid grid-cols-2 gap-2">
                                            <Button onClick={() => handleSignUp(sheet.id)}>Sign Up</Button>
                                            <Button>Sign Up For Admin</Button>
                                        </div>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex pb-2">
                                    <Icons.award className="pe-2" /> Loot owner : {sheet.loot_owner}
                                </div>
                                <Separator />
                                <div className="flex py-4">
                                    {sheet.detail}
                                    {/* {sheet.detail.map((detai, index) => {
                                        return (
                                            <>adsa</>
                                        )
                                    })} */}
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
