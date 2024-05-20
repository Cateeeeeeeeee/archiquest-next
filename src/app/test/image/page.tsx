"use client";
import { generateImageFal } from "@/ai/fal";
import { generateImageDalle } from "@/ai/openai";
import Spinner from "@/components/Spinner";
import { useEffect, useState } from "react";

//compare response times for different text and image generation models
export default function Page() {
  const [dalle, setDalle] = useState<string | null>();
  const [dalle2, setDalle2] = useState<string | null>();
  const [falSDTurbo, setFalSDTurbo] = useState<string | null>(null);
  const [falSDXL, setFalSDXL] = useState<string | null>(null);
  const [firstRun, setFirstRun] = useState<boolean>(true);

  const handleRunTest = async () => {
    setDalle(null);
    setDalle2(null);
    setFalSDTurbo(null);
    setFalSDXL(null);
    setFirstRun(false);
    const prompt =
      "A photograph of an oil refinery, Canon EOS 5D Mark IV, 24mm, f/8, 1/250s, ISO 100, 2019";
    const time = new Date().getTime();

    generateImageFal(prompt, "landscape_16_9", "fast-turbo-diffusion").then(
      (url) => {
        setFalSDTurbo(url ?? "");
        console.log("FalSDTurbo", new Date().getTime() - time);
      }
    );
    generateImageFal(prompt, "landscape_16_9", "fast-sdxl").then((url) => {
      setFalSDXL(url ?? "");
      console.log("FalSDXL", new Date().getTime() - time);
    });
    generateImageDalle(prompt, "dall-e-2", "512x512").then((url) => {
      setDalle2(url ?? "");
      console.log("Dalle 2", new Date().getTime() - time);
    });
    generateImageDalle(prompt, "dall-e-3", "1792x1024").then((url) => {
      setDalle(url ?? "");
      console.log("Dalle", new Date().getTime() - time);
    });
  };
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <button className="bg-white rounded-lg p-2 mb-4" onClick={handleRunTest}>
        {firstRun == false &&
        (dalle == null || falSDTurbo == null || falSDXL == null)
          ? "Generating..."
          : "Run Test"}
      </button>
      {!firstRun && (
        <div className="z-10 w-full grid grid-cols-2 gap-4">
          <TestImage src={falSDTurbo} title="Fal Turbo Diffusion, 1024x576" />
          <TestImage src={falSDXL} title="Fal SDXL, 1024x576" />
          <TestImage src={dalle2 ?? ""} title="Dalle-2, 512x512" />
          <TestImage src={dalle ?? ""} title="Dalle-3, 1792x1024" />
        </div>
      )}
    </main>
  );
}

function TestImage({ src, title }: { src: string | null; title: string }) {
  return (
    <div className="relative w-full min-h-[128px]">
      <h1>{title}</h1>
      {src && <img className="w-full" src={src} />}
      {!src && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
