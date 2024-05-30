import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveScore = async (name: string, score: number, imageUrl: string) => {
  const { data, error } = await supabase
    .from('scores')
    .insert([{ name, score, image_url: imageUrl }])
    .select();

  if (error) {
    console.error('Error saving score:', error);
  }

  return data;
};

export const getScores = async () => {
  const { data, error } = await supabase
    .from('scores')
    .select('name, score, image_url')
    .order('score', { ascending: false });

  if (error) {
    console.error('Error fetching scores:', error);
    return [];
  }

  return data;
};

export const uploadImage = async (imageData: string, fileName: string) => {
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, decode(imageData), {
      contentType: 'image/jpeg',
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { publicURL, error: urlError } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  if (urlError) {
    console.error('Error getting public URL:', urlError);
    return null;
  }

  return publicURL;
};

function decode(base64Data: string) {
  const byteCharacters = atob(base64Data.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return byteArray;
}