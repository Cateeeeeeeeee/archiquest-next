"use client";
// src/components/TreasureClues.tsx
import TagCloud from "./TagCloud";
import ImageGallery from "./ImageGallery";
import TextToSpeech from "./TextToSpeech";
import { generateImageFal, getGroqCompletion } from "@/ai/fal";
import { describeImagePrompt } from "@/ai/prompts";
import { useState, useEffect } from "react";

export default function TreasureClues() {
  const [keywords, setKeywords] = useState("");
  const [imageHints, setImageHints] = useState<string[]>([]);
  const [riddle, setRiddle] = useState("");

  useEffect(() => {
    const generateClues = async () => {
      // Generate keywords using the TagCloud component
      const prompt = "Generate keywords related to a treasure hunt environment";
      const keywords = await getGroqCompletion(prompt, 64, generateTagsPrompt);
      setKeywords(keywords);

      // Generate image hints using the ImageGallery component
      const imageDescriptions = await getGroqCompletion(
        prompt,
        64,
        describeImagePrompt
      );
      const imageHints = await Promise.all(
        imageDescriptions.split("\n").map((desc) => generateImageFal(desc, "square"))
      );
      setImageHints(imageHints);

      // Generate a riddle using the TextToSpeech component
      const riddle = await getGroqCompletion(
        `Generate a riddle related to ${keywords}`,
        64,
        ""
      );
      setRiddle(riddle);
    };

    generateClues();
  }, []);

  return (
    <div>
      <TagCloud prompt={keywords} totalTags={20} handleSelect={(tags) => {}} />
      <ImageGallery images={imageHints.map((url) => ({ src: url, title: "" }))} />
      <TextToSpeech text={riddle} showControls autoPlay />
    </div>
  );
}