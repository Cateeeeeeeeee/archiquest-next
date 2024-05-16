"use client";

import React, { useState, useEffect } from 'react';
import Panorama from '@/components/Panorama';
import TreasureClues from '@/components/TreasureClues';
import Leaderboard from '@/components/Leaderboard';
import { startNewRound, checkTreasureLocation, updateScore } from './gameLogic';

export default function TreasureHuntPage() {
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [panoramaImages, setPanoramaImages] = useState<string[]>([]);
  const [clues, setClues] = useState<string[]>([]);

  useEffect(() => {
    // Start a new round when the component mounts or the round changes
    const startRound = async () => {
      const { images, clues } = await startNewRound(round);
      setPanoramaImages(images);
      setClues(clues);
    };

    startRound();
  }, [round]);

  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    // Clear the timer when the component unmounts or the round changes
    return () => {
      clearInterval(timer);
    };
  }, [round]);

  const handleTreasureFound = async (selectedRegion: string) => {
    const isFound = await checkTreasureLocation(selectedRegion);
    if (isFound) {
      const pointsEarned = await updateScore(round, timeRemaining, 'player1'); // Placeholder userId
      setScore((prevScore) => prevScore + pointsEarned);
      setRound((prevRound) => prevRound + 1);
      setTimeRemaining(300); // Reset the timer for the next round
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Treasure Hunt in AI-Generated Worlds</h1>
      <Panorama images={panoramaImages} onTreasureFound={handleTreasureFound} />
      <TreasureClues clues={clues} />
      <div>
        <p>Round: {round}</p>
        <p>Score: {score}</p>
        <p>Time Remaining: {timeRemaining} seconds</p>
      </div>
      <Leaderboard />
    </main>
  );
}