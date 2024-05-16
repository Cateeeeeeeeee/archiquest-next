"use client";
import React from 'react';

export default function Leaderboard() {
  // Placeholder leaderboard data
  const scores = [
    { id: 1, user_id: 'player1', score: 100 },
    { id: 2, user_id: 'player2', score: 90 },
    { id: 3, user_id: 'player3', score: 80 },
  ];

  return (
    <div>
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score.id}>
              <td>{index + 1}</td>
              <td>{score.user_id}</td>
              <td>{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}