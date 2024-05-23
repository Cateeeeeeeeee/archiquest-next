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
    <main className="relative min-h-screen">
      {/* 插入视频,填充整个页面 */}
      <video
        src="https://s19.aconvert.com/convert/p3r68-cdx67/ok9qm-j05c0.mp4"
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* 添加玩家名字输入和"开始游戏"按钮 */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="px-4 py-2 mb-4 text-xl text-gray-700 bg-white rounded shadow"
        />
        <button
          onClick={handleStart}
          className="px-8 py-4 text-2xl font-bold text-white bg-blue-500 rounded opacity-75 hover:opacity-100 transition duration-300 ease-in-out transform hover:scale-110 mb-8"
        >
          Start Game
        </button>

        {/* 添加游戏玩法说明 */}
        <div className="p-4 bg-white rounded shadow-lg w-1/2">
          <h2 className="text-2xl font-bold mb-2">How to Play</h2>
          <ul className="list-disc pl-4">
            <li>Enter your name and click "Start Game".</li>
            <li>Explore the panoramic environment by clicking and dragging.</li>
            <li>Click on interesting areas to analyze and collect specimens.</li>
            <li>Identify rare and exotic creatures to score points.</li>
            <li>Check your backpack and discoveries.</li>
            <li>Complete the exploration within the time limit.</li>
            <li>Your score will be recorded on the leaderboard.</li>
          </ul>
        </div>
      </div>

      {/* 添加分数排行榜 */}
      <div className="absolute bottom-0 left-0 w-full p-4">
        <Leaderboard />
      </div>
    </main>
  );
}