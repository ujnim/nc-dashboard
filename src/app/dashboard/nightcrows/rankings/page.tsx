"use client"

import { trpc } from "@/utils/trpc"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RankingsPage() {
    const { data: rankings, isLoading } = trpc.nightCrows.getRankings.useQuery()

    if (isLoading) {
        return <div className='h-[calc(100vh-4rem)] w-full overflow-y-auto p-2 sm:p-5'>Loading rankings...</div>
    }

    return (
        <div className='h-[calc(100vh-4rem)] w-full overflow-y-auto p-2 sm:p-5'>
            <Card>
                <CardHeader>
                    <CardTitle>Night Crows Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Character Name</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Class</TableHead>
                                <TableHead>Guild</TableHead>
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rankings?.map((ranking, index) => (
                                <TableRow key={index + 1}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{ranking.name}</TableCell>
                                    <TableCell>{ranking.lv}</TableCell>
                                    <TableCell>{ranking.class}</TableCell>
                                    <TableCell>{ranking.guild}</TableCell>
                                    <TableCell>{ranking.total}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
