import { getPanorama } from '@/ai/blockade';
import { getGroqCompletion } from '@/ai/groq';
import { getGeminiVision } from '@/ai/gemini';
// import { supabase } from '@/supabase/supabase';

export async function startNewRound(round: number) {
  const prompt = `Generate a unique panoramic environment for a treasure hunt game, round ${round}.`;

  const panoramaImages = await Promise.all([
    getPanorama(`${prompt}, right`),
    getPanorama(`${prompt}, left`),
    getPanorama(`${prompt}, top`),
    getPanorama(`${prompt}, bottom`),
    getPanorama(`${prompt}, front`),
    getPanorama(`${prompt}, back`),
  ]);

  const cluePrompt = `Generate three clues for a treasure hidden in a ${prompt}.`;
  const clues = await getGroqCompletion(cluePrompt, 100, '');

  return {
    images: panoramaImages,
    clues: clues.split(',').map((clue) => clue.trim()),
  };
}

export async function checkTreasureLocation(selectedRegion: string) {
  const prompt = `Analyze the selected region and determine if the treasure is present.`;
  const analysis = await getGeminiVision(prompt, selectedRegion);

  return analysis.includes('treasure found');
}

export async function updateScore(round: number, timeRemaining: number, userId: string) {
  const baseScore = 100;
  const timeBonus = Math.floor(timeRemaining / 30); // Bonus points for every 30 seconds remaining

  const score = baseScore + timeBonus;

  // Update the player's score in the database (Supabase)
  await updatePlayerScore(userId, score);

  return score;
}

// Function to update the player's score in the Supabase database
async function updatePlayerScore(userId: string, score: number) {
  // Placeholder for updating player score
  console.log(`Updating player score: userId=${userId}, score=${score}`);

  // const { data, error } = await supabase
  //   .from('player_scores')
  //   .insert([{ user_id: userId, score: score }]);

  // if (error) {
  //   console.error('Error updating player score:', error);
  // } else {
  //   console.log('Player score updated successfully');
  // }
}