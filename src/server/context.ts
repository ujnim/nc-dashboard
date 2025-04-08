import { createClient } from '@supabase/supabase-js';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function createContext({
  req,
  resHeaders,
}: FetchCreateContextFnOptions) {
  return {
    req,
    resHeaders,
    supabase,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;