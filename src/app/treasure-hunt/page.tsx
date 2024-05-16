"use client";
import Panorama from "@/components/Panorama";
import TreasureClues from "@/components/TreasureClues";
import QuestionAnswer from "@/components/QuestionAnswer";
import { useEffect, useState } from "react";
import { getPanorama } from "@/ai/blockade";

export default function TreasureHunt() {
  const [panorama, setPanorama] = useState("");
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes

  useEffect(() => {
    // Generate a new panorama for the round
    const generatePanorama = async () => {
      const prompt = "Generate a panoramic view of a treasure hunt environment";
      const panoramaUrl = await getPanorama(prompt);
      setPanorama(panoramaUrl);
    };

    generatePanorama();

    // Start the timer
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleTreasureFound = (found: boolean) => {
    if (found) {
      // Update score based on time remaining
      setScore((prevScore) => prevScore + timeRemaining);
    }
    // Start a new round
  };

  const handleCorrectAnswer = () => {
    // Award bonus points for a correct answer
    setScore((prevScore) => prevScore + 100); // Adjust the bonus points as needed
  };

  return (
    <div>
      <Panorama
        img={panorama}
        onTreasureFound={handleTreasureFound}
        timeRemaining={timeRemaining}
      />
      <TreasureClues />
      <div>Score: {score}</div>
      <QuestionAnswer onCorrectAnswer={handleCorrectAnswer} />
    </div>
  );
}