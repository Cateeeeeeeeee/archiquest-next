"use client";
import { getPanorama } from "@/ai/blockade";
import { getGeminiVision } from "@/ai/gemini";
import { generateImageFal, getGroqCompletion } from "@/ai/fal";
import { describeImagePrompt, generateTagsPrompt } from "@/ai/prompts";

export const startNewRound = async () => {
  // Generate a new panorama
  const prompt = "Generate a panoramic view of a treasure hunt environment";
  const panoramaUrl = await getPanorama(prompt);

  // Generate clues
  const clues = await generateClues();

  return { panoramaUrl, clues };
};

export const checkTreasureLocation = async (imgUrl: string) => {
  const description = await getGeminiVision(
    "Identify if there is a treasure in this image.",
    imgUrl
  );
  return description.includes("treasure");
};

const generateClues = async () => {
  // Generate keywords using the TagCloud component
  const prompt = "Generate keywords related to a treasure hunt environment";
  const keywords = await getGroqCompletion(prompt, 64, generateTagsPrompt);

  // Generate image hints using the ImageGallery component
  const imageDescriptions = await getGroqCompletion(
    prompt,
    64,
    describeImagePrompt
  );
  const imageHints = await Promise.all(
    imageDescriptions.split("\n").map((desc) => generateImageFal(desc, "square"))
  );

  // Generate a riddle using the TextToSpeech component
  const riddle = await getGroqCompletion(
    `Generate a riddle related to ${keywords}`,
    64,
    ""
  );

  return { keywords, imageHints, riddle };
};