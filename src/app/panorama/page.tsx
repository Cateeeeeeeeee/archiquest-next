"use client";
import { getPanorama } from "@/ai/blockade";
import {
  creativeUpscale,
  generateImageFal,
  generateImageToImageFal,
} from "@/ai/fal";
import { getGeminiVision } from "@/ai/gemini";
import { getOpenAICompletion } from "@/ai/openai";
import Panorama from "@/components/Panorama";
import Spinner from "@/components/Spinner";
import { useState, useEffect, useRef } from "react";
import { saveScore } from "@/supabase/supabase";
import { useRouter } from 'next/navigation';

const prompts = [
  "A dense tropical rainforest with towering trees, thick undergrowth, and a variety of colorful plants. The air is humid, and sunlight filters through the canopy, creating dappled patterns on the forest floor. Exotic birds, insects, and small mammals can be seen in their natural habitat.",
  "A vast savanna with golden grasses stretching as far as the eye can see. Scattered acacia trees provide sparse shade, and the sky is a brilliant blue. Herds of zebras, antelopes, and giraffes roam the plains, while lions and other predators lurk in the distance",
  "A cold, snowy arctic tundra with vast expanses of ice and snow. The landscape is dotted with hardy shrubs and lichen, and the sky has a pale, ethereal glow. Polar bears, arctic foxes, and seals can be seen in this frozen wilderness",
];

const musicUrls = [
  'https://s19.aconvert.com/convert/p3r68-cdx67/b85wk-o00tp.mp3',
  'https://s27.aconvert.com/convert/p3r68-cdx67/5dc3c-bc6lh.mp3',
  'https://s31.aconvert.com/convert/p3r68-cdx67/jgsgo-fc1ex.mp3',
];

export default function App() {
  const [fetching, setFetching] = useState<boolean>(false);
  const [img, setImg] = useState<string>("/M3_Photoreal_hdri-hdr_A_dense_tropical_rainforest_1345358637_11062534.hdr");
  const [prompt, setPrompt] = useState<string>(prompts[0]);
  const [selectedImg, setSelectedImage] = useState<string>("");
  const [description, setDescription] = useState<string>(
    "Hold shift and drag to explore"
  );
  const [upscaling, setUpscaling] = useState<boolean>(false);
  const [backpack, setBackpack] = useState<string[]>([]);
  const [showBackpack, setShowBackpack] = useState<boolean>(false);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const [showDiscoveries, setShowDiscoveries] = useState<boolean>(false);
  const [speciesAnalysis, setSpeciesAnalysis] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [selectCount, setSelectCount] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(120);
  const router = useRouter();

  const backpackRef = useRef<HTMLDivElement>(null);
  const discoveriesRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        backpackRef.current &&
        !backpackRef.current.contains(event.target as Node)
      ) {
        setShowBackpack(false);
      }

      if (
        discoveriesRef.current &&
        !discoveriesRef.current.contains(event.target as Node)
      ) {
        setShowDiscoveries(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (img === "") {
      handleCreate();
    }
  }, [img]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = musicUrls[prompts.indexOf(prompt)];
      audioRef.current.play();
    }
  }, [prompt]);

  useEffect(() => {
    if (countdown === 0) {
      handleSaveScore();
    }
  }, [countdown]);

  const handleCreate = async () => {
    setFetching(true);
    const newPrompt =
      "A photograph of " +
      prompt +
      ", possibly containing rare and exotic creatures. Canon EOS 5D Mark IV, 24mm, f/8, 1/250s, ISO 100, 2019";
    const pano = await generateImageFal(newPrompt);
    if (pano) setImg(pano);
    setFetching(false);
  };

  const handleSelect = async (imgUrl: string) => {
    setSelectedImage(imgUrl);
    setUpscaling(true);
    setSpeciesAnalysis("");

    const upscaled = await creativeUpscale(imgUrl);
    setSelectedImage(upscaled);
    try {
      const base64 = await convertImageToBase64JPEG(upscaled);
      setImg(base64);
      setBackpack([...backpack, base64]);

      const analysis = await getGeminiVision(
        `You will be provided with an image of ${prompt}. Identify and list the species of any creatures or plants present in the image. If no specific species can be identified, provide a general description of the types of creatures or plants visible.`,
        base64
      );
      setSpeciesAnalysis(analysis);

      const score = calculateScore(analysis);
      setScore(prevScore => prevScore + score);

      if (score > 0) {
        setDiscoveries(prevDiscoveries => [...prevDiscoveries, `${analysis} (${score} points)`]);
      } else {
        setDiscoveries(prevDiscoveries => [...prevDiscoveries, "No clear animals or insects found."]);
      }
    } catch (e) {
      console.error("error creating new pano", e);
    }

    setSelectCount(prevCount => prevCount + 1);
    setUpscaling(false);

    if (selectCount === 2) {
      setSelectCount(0);
      const currentIndex = prompts.indexOf(prompt);
      if (currentIndex < prompts.length - 1) {
        setPrompt(prompts[currentIndex + 1]);
      } else {
        handleSaveScore();
      }
    }
  };

  const handleSaveScore = async () => {
    const playerName = localStorage.getItem("playerName");
    if (playerName) {
      await saveScore(playerName, score, img);
    }
    router.push("/");
  };

  function calculateScore(analysis: string): number {
    if (analysis.includes("animal") || analysis.includes("insect")) {
      return 5; // 如果分析结果明确提到动物或昆虫,得5分
    } else {
      return 0; // 其他情况不得分
    }
  }

  return (
    <>
      <audio ref={audioRef} loop />
      <main className="flex flex-col w-full h-screen min-h-screen">
        <div className="flex justify-between gap-4 m-2">
          <button
            disabled={fetching}
            className="p-2 w-full rounded bg-white"
            onClick={handleCreate}
          >
            {fetching ? "Exploring..." : "Explore new place"}
          </button>
        </div>
        <div className="relative w-full h-full">
          <Panorama img={img} onSelect={handleSelect} immersive={false} />
          <div className="absolute top-0 left-0 p-4 flex flex-col max-w-sm">
            <p className="text-xs bg-white p-2">{description}</p>
            <div className="relative">
              {selectedImg && (
                <img className="w-full h-full" src={selectedImg} />
              )}
              {upscaling && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <Spinner />
                </div>
              )}
              {speciesAnalysis && (
                <div className="absolute top-0 left-0 p-2 bg-white text-xs">
                  <p>{speciesAnalysis}</p>
                </div>
              )}
            </div>
          </div>
          <div className="fixed top-16 left-1/2 transform -translate-x-1/2 p-2 bg-white text-lg">
            <p>Score: {score}</p>
            <p>Time Left: {countdown}s</p>
          </div>
          <button
            className="absolute top-0 right-0 m-4 p-2 bg-white rounded"
            onClick={() => setShowBackpack(!showBackpack)}
          >
            Backpack ({backpack.length})
          </button>
          {showBackpack && (
            <div
              ref={backpackRef}
              className="fixed top-0 right-0 bottom-0 w-1/2 p-6 bg-white shadow-lg overflow-y-auto"
            >
              <h2 className="text-3xl font-bold mb-6">Backpack</h2>
              <div className="grid grid-cols-2 gap-6">
                {backpack.map((img, index) => (
                  <div key={index} className="w-full h-64 overflow-hidden">
                    <img
                      src={img}
                      alt={`Backpack item ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            className="absolute bottom-0 right-0 m-4 p-2 bg-white rounded"
            onClick={() => setShowDiscoveries(!showDiscoveries)}
          >
         Discoveries ({discoveries.length})
          </button>
          {showDiscoveries && (
            <div
              ref={discoveriesRef}
              className="absolute bottom-0 right-0 m-4 p-4 bg-white rounded shadow-lg"
            >
              <h2 className="text-xl font-bold mb-4">Discovered Creatures</h2>
              <ul>
                {discoveries.map((discovery, index) => (
                  <li key={index}>{discovery}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

async function convertImageToBase64JPEG(url: string) {
  try {
    const img = new Image();
    img.src = url;
    img.crossOrigin = "anonymous";
    return new Promise<string>((resolve, reject) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        const jpegBase64 = canvas.toDataURL("image/jpeg");
        resolve(jpegBase64);
      };

      img.onerror = (error) => {
        reject(error);
      };
    });
  } catch (error) {
    console.error("Error converting image:", error);
    throw error;
  }
}