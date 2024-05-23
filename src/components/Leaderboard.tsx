"use client";
import { useEffect, useState } from "react";
import { getScores } from "@/supabase/supabase";

export default function Leaderboard() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      const data = await getScores();
      setScores(data);
    };
    fetchScores();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Score board</h2>
      <ul>
        {scores.map((score, index) => (
          <li key={score.id} className="mb-2">
            {index + 1}. {score.name}: {score.score}
          </li>
        ))}
      </ul>
    </div>
  );
}