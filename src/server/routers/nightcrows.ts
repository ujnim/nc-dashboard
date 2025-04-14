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

    getMaxParticipation: publicProcedure
        .query(async ({ ctx }) => {
            const { data: info, error } = await ctx.supabase
                .from('rankings')
                .select('join_war')
                .order('join_war', { ascending: false })
                .limit(1)
                .single();

            if (error) throw error;
            return info;
        }),

    getInfoAccountNightcrowsByUser: publicProcedure
        .input(z.object({
            name: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const { data: info, error } = await ctx.supabase
                .from('nightcrows_accounts')
                .select('character_name,server,guild,class,level,atk,acc,def,cp')
                .eq('character_name', input.name)
                .single();

            if (error) throw error;
            return info;
        }),

        getSignupBoss: publicProcedure
        .query(async ({ ctx }) => {
            const { data: signups } = await ctx.supabase
                .from('sign_up_boss')
                .select('*')
                .is('loot_owner', null)
                .order('created_at', { ascending: false });

            const transformedSignups = await Promise.all(
                signups?.map(async (signup) => {
                    if (signup.detail && Array.isArray(signup.detail)) {
                        const uniqueNames = [...new Set(signup.detail)];
                        
                        const playerDetails = await Promise.all(
                            uniqueNames.map(async (playerName) => {
                                const { data: player } = await ctx.supabase
                                    .from('nightcrows_accounts')
                                    .select('*,rankings(today_loot, total)')
                                    .eq('character_name', playerName)
                                    .single();
                        
                                const ranking = player?.rankings?.[0] || null;
                                return { ...player, ranking };
                            })
                        );
                        
                        return { ...signup, playerDetails, detail: uniqueNames };
                    }
                    return signup;
                }) || []
            );

            return transformedSignups;
        }),

    updateSignupBoss: publicProcedure
        .input(z.object({
            id: z.number(),
            username: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            if (!input.username) {
                throw new Error('Please login to sign up');
            }

            const { data: signup, error: fetchError } = await ctx.supabase
                .from('sign_up_boss')
                .select('*')
                .eq('id', input.id)
                .single();

            if (fetchError) throw fetchError;
            if (!signup) throw new Error('Signup not found');
            
            // Check if username already exists in detail
            const currentSignups = signup.detail || [];
            if (currentSignups.includes(input.username)) {
                return { message: 'Already signed up', status: 'info' };
            }

            const { data, error } = await ctx.supabase
                .from('sign_up_boss')
                .update({
                    detail: [...currentSignups, input.username]
                })
                .eq('id', input.id)
                .select();

            if (error) throw error;
            return { data, message: 'Signup successful', status: 'success' };
        }),

});