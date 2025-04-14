"use client"

import { trpc } from "@/utils/trpc"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { Separator } from "@/components/ui/separator"
import { CreateSheet } from "@/components/create-sheet"
import { formatDateUTC8, statusBossCave } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function SignUpBossPage() {
    const queryClient = useQueryClient()
    const { data: sheets, isLoading, refetch } = trpc.nightCrows.getSignupBoss.useQuery()
    console.log(sheets)

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
        onSuccess: (response) => {
            if (response.status === 'info') {
                toast.info(response.message);
            } else if (response.status === 'success') {
                toast.success(response.message);
                refetch();
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleSignUp = async (sheetId: number) => {
        try {
            if (!getAccountGame.data?.character_name) {
                toast.error("Please login first");
                return;
            }
            
            await updateSignup.mutateAsync({
                id: sheetId,
                username: getAccountGame.data.character_name,
            });
        } catch (error) {
            console.error("Error signing up:", error);
        }
    }

    const PlayerInfoCard = ({ playerName }: { playerName: string }) => {
        const { data: playerInfo } = trpc.nightCrows.getInfoAccountNightcrowsByUser.useQuery({ name: playerName }, { enabled: !!playerName })

        const { data: xxx } = trpc.nightCrows.getMaxParticipation.useQuery()
        console.log(xxx)

        const { text, color } = statusBossCave(playerInfo?.cp, playerInfo?.acc, playerInfo?.def, 10, playerInfo?.class)

        return (
            <>
                {playerInfo && (
                    <TableRow key={playerInfo.character_name}>
                        <TableCell>{playerName}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">
                                {playerInfo.atk} / {playerInfo.acc} / {playerInfo.def}
                            </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                            <Badge variant="secondary">
                                {playerInfo.guild} - {playerInfo.class}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={color}>{text}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                            <Badge variant="secondary">Lv.{playerInfo.level}sss</Badge>
                        </TableCell>
                    </TableRow>
                )}
            </>
        )
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
                                    <Icons.award className="pe-2" /> Loot owner :{" "}
                                    {sheet.playerDetails?.reduce((lowestPlayer : any, player : any) => {
                                        if (!player?.ranking?.today_loot && (!lowestPlayer || (player?.ranking?.total || 0) < (lowestPlayer?.ranking?.total || 0))) {
                                            return player
                                        }
                                        return lowestPlayer
                                    }, null)?.character_name || "Not assigned"}
                                </div>
                                <Separator />
                                <div className="flex py-4 flex-col gap-2">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-auto">Name</TableHead>
                                                <TableHead>ATK / ACC / DEF</TableHead>
                                                <TableHead>Guild / Job</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">AVG.</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {sheet.detail?.map((playerName: string, index: any) => (
                                                <PlayerInfoCard key={index} playerName={playerName} />
                                            ))}
                                        </TableBody>
                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={4}>Total</TableCell>
                                                <TableCell className="text-right">$2,500</TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
