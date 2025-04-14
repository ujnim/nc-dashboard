import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { trpc } from "@/utils/trpc"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateUTC8(date: string | Date) {
  return new Date(date).toLocaleString("th-TH", {
    timeZone: "Asia/Singapore",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })
}

export function statusBossCave(cp: number, acc: number, def: number, participation: number, job: string) {
  const maxParticipation = trpc.nightCrows.getMaxParticipation.useQuery()
  
  // Check participation first
  if (participation < (maxParticipation.data?.join_war*0.3)) return { "text": 'Low participation', "color": 'text-red-500' }
  
  // Special job cases
  if (job === 'Healer') return { "text": 'Normal-Healer', "color": 'text-purple-400' }
  if (job === 'Boss SS1') return { "text": 'Deduct Boss SS1', "color": 'text-red-800' }

  // Check CP requirement
  if (cp < 130000) return { "text": 'Low CP', "color": 'text-red-500' }

  // Determine status based on def and acc stats
  if (def >= 750 && acc >= 750) return { "text": 'Boss', "color": 'text-red-500' }
  if (acc >= 520) return { "text": 'Normal R4', "color": 'text-green-500' }
  if (def >= 460) return { "text": 'Normal R3', "color": 'text-green-500' }
  if (def >= 440) return { "text": 'Normal C9', "color": 'text-green-500' }
  if (def >= 380) return { "text": 'Normal C8', "color": 'text-green-500' }
  if (def >= 340) return { "text": 'Normal C7', "color": 'text-green-500' }

  return { "text": 'Normal', "color": 'text-green-500' }
}