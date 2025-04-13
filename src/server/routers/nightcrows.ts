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

    createSignupBoss: publicProcedure
        .input(z.object({
            boss: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { data, error } = await ctx.supabase
                .from('sign_up_boss')
                .insert([input])
                .select();
            if (error) throw error;
            return data;
        }),

    getAccountGame: publicProcedure
        .input(z.object({
            uuid: z.string(),
            game: z.string()
        }))
        .query(async ({ ctx, input }) => {
            if (input.game === 'nightcrows') {
                const { data: account, error } = await ctx.supabase
                    .from('nightcrows_accounts')
                    .select('character_name ,server ,guild ,class ,level ,atk ,acc ,def, cp')
                    .eq('user_id', input.uuid)
                    .single();
                if (error) throw error;
                return account;
            }
            return null;
        }),

    getSignupBoss: publicProcedure
        .query(async ({ ctx }) => {
            const { data: signups } = await ctx.supabase
                .from('sign_up_boss')
                .select('*')
                .is('loot_owner', null);
            return signups;
        }),

    updateSignupBoss: publicProcedure
        .input(z.object({
            id: z.number(),
            username: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const { data: signup, error: fetchError } = await ctx.supabase
                .from('sign_up_boss')
                .select('*')
                .eq('id', input.id)
                .single();

            if (fetchError) throw fetchError;
            if (!signup) throw new Error('Signup not found');

            const { data, error } = await ctx.supabase
                .from('sign_up_boss')
                .update({
                    detail: [...(signup.detail || []), input.username]
                })
                .eq('id', input.id)
                .select();

            if (error) throw error;
            return data;
        }),


    // addBossSignup: publicProcedure
    //     .input(z.object({
    //         bossName: z.string(),
    //         location: z.string(),
    //         time: z.string(),
    //         date: z.string(),
    //     }))
    //     .mutation(async ({ ctx, input }) => {
    //         const { data, error } = await ctx.supabase
    //             .from('nightcrows_boss_signups')
    //             .insert([input])
    //             .select();

    //         if (error) throw error;
    //         return data;
    //     }),
});