import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const nightCrowsRouter = createTRPCRouter({
  getRankings: publicProcedure
    .query(async ({ ctx }) => {
      const { data: rankings } = await ctx.supabase
        .from('leader_board')
        .select('*')
        .not('total', 'eq', 0)
        .order('total', { ascending: true });
      
      return rankings;
    }),

  addBossSignup: publicProcedure
    .input(z.object({
      bossName: z.string(),
      location: z.string(),
      time: z.string(),
      date: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase
        .from('nightcrows_boss_signups')
        .insert([input])
        .select();

      if (error) throw error;
      return data;
    }),
});