import { useEffect, useState } from "react";
import { supabase } from "@/supabase/supabase";

interface LeaderboardEntry {
  id: number;
  created_at: string;
  name: string;
  score: number;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("id, created_at, name, score")
        .order("score", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching leaderboard data:", error);
      } else {
        setLeaderboardData(data as LeaderboardEntry[]);
      }
    };

    fetchLeaderboardData();
  }, []);

  return (
    <div className="bg-white rounded shadow-lg p-4 font-serif text-green-800">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 text-left">Rank</th>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry, index) => (
            <tr key={entry.id}>
              <td className="py-2 px-4 text-left">{index + 1}</td>
              <td className="py-2 px-4 text-left">{entry.name}</td>
              <td className="py-2 px-4 text-right">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}