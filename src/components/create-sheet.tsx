'use client';

import { trpc } from "@/utils/trpc"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BossCaves } from "@/constants/data"
import { toast } from "sonner"

export function CreateSheet({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const createBossSignup = trpc.nightCrows.createSignupBoss.useMutation({
        onSuccess: () => {
            toast.success("Boss signup created successfully")
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const handleBossSelect = (boss: string) => {
        createBossSignup.mutate({
            boss,
        })
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">Create Sheet</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {BossCaves.map((item, index) => {
                    return (
                        <div key={index}>
                            <DropdownMenuLabel>{item.type}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                {item.items?.map((cave) => {
                                    return (
                                        <DropdownMenuItem key={cave.id} onClick={() => handleBossSelect(cave.name)}>
                                            {cave.name}
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuGroup>
                        </div>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
