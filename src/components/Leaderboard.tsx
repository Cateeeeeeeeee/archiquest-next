"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";

interface Score {
  id: string;
  name: string;
  score: number;
  panorama: string; // Add a new field for the panorama URL
}

export default function Leaderboard() {
  const [scores, setScores] = useState<Score[]>([]);

  useEffect(() => {
    const fetchScores = async () => {
      const { data } = await supabase.from("scores").select().order("score", { ascending: false });
      setScores(data as Score[]);
    };

    fetchScores();
  }, []);

  const shareScore = (score: Score) => {
    // Share the score and panorama on social media
    const shareUrl = `https://yourgame.com/share?score=${score.score}&panorama=${encodeURIComponent(score.panorama)}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div>
      <h2>Leaderboard</h2>
      {scores.map((score) => (
        <div key={score.id}>
          {score.name}: {score.score}{" "}
          <button onClick={() => shareScore(score)}>Share</button>
        </div>
      ))}
    </div>
  );
}