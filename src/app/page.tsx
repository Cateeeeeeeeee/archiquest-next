'use client';
import Link from "next/link";
import { useState } from "react";
import Leaderboard from "@/components/Leaderboard";

export default function Home() {
  const [playerName, setPlayerName] = useState("");

  const handleStart = () => {
    if (playerName.trim() !== "") {
      localStorage.setItem("playerName", playerName);
      window.location.href = "/panorama";
    }
  };

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-green-700 to-green-900 text-white">
      {/* Insert video and fill the entire page */}
      <video
        src="/videos/Gen-2 3853313874, biologists in a dens, skye00000_A_highly_d, M 5.mp4"
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Add player name input and "Start Game" button */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="px-4 py-2 mb-4 text-xl text-white bg-green-800 rounded-md shadow font-serif"
        />
        <Link href="/panorama">
          <button
            onClick={handleStart}
            className="px-8 py-4 text-2xl font-bold text-white bg-green-600 rounded-md opacity-75 hover:opacity-100 transition duration-300 ease-in-out transform hover:scale-110 mb-8 font-old-english"
          >
            Begin Expedition
          </button>
        </Link>

        {/* Add gameplay instructions */}
        <div className="p-4 bg-green-800 rounded-md opacity-75 shadow-lg w-1/2 font-serif">
          <h2 className="text-2xl font-bold mb-2">Expedition Guide</h2>
          <ul className="list-disc pl-4">
            <li>Enter your name and begin the expedition.</li>
            <li>Explore the wild realms by clicking and dragging.</li>
            <li>Discover rare and exotic creatures to score points.</li>
            <li>Check your backpack and discoveries.</li>
            <li>Complete the expedition before time runs out.</li>
            <li>Your score will be recorded on the leaderboard.</li>
          </ul>
        </div>
      </div>

      {/* Add score ranking list */}
      <div className="absolute bottom-0 left-0 w-full p-4 font-serif">
        <Leaderboard />
      </div>
    </main>
  );
}