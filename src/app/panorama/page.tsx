"use client";
import { getPanorama } from "@/ai/blockade";
import Panorama from "@/components/Panorama";
import { useState } from "react";

export default function App() {
  const [fetching, setFetching] = useState<boolean>(false);
  const [img, setImg] = useState<string>("/old_depot_2k.hdr");
  const [prompt, setPrompt] = useState<string>("a beautiful epic view of a lost civilization with glittering waterfalls, rusting advanced futuristic technology, bright greenblue pool below, abandoned white high tech buildings, a large pale pink sky over massive waterfalls. microdetailed, masterpiece");
  const handleCreate = async () => {
    setFetching(true);
    const pano = await getPanorama(prompt);
    if (pano) setImg(pano);
    setFetching(false);
  };

  return (
    <main className="flex flex-col w-full h-screen min-h-screen">
      <div className="flex justify-between gap-4 m-2">
        <input
          className="w-full rounded"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        ></input>
        <button
          disabled={fetching}
          className="p-2 w-full rounded bg-white"
          onClick={handleCreate}
        >
          {fetching ? "Generating skybox..." : "Create"}
        </button>
      </div>

      <Panorama img={img} />
    </main>
  );
}
