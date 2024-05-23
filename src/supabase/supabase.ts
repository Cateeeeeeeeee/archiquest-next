import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveScore = async (name: string, score: number, panorama: string) => {
  const { data, error } = await supabase.from('scores').insert([{ name, score, panorama }]).select();

  if (error) {
    console.error('Error saving score:', error);
  }

  return data;
};

export const getScores = async () => {
  const { data, error } = await supabase
    .from('scores')
    .select()
    .order('score', { ascending: false });

  if (error) {
    console.error('Error fetching scores:', error);
    return [];
  }

  return data;
};