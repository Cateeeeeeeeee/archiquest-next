import { generateImageFal, generateVideoFal } from "@/ai/fal";
import { getGroqCompletion } from "@/ai/groq";
import { ReactNode, useEffect, useRef, useState } from "react";
import Blend, { BlendImage } from "./Blend";

type AnimationProps = {
  prompt: string;
  systemPrompt: string;
  imageSize: "landscape_16_9" | "square";
  animate: number;
  fullscreen: boolean;
  onChange?: (url: string) => void;
  video?: boolean;
};

//Component that uses groq to generate image descriptions from prompts, then uses fal to generates the image and blends them together.
//All runs on an animation timer
export default function Animation({
  prompt,
  systemPrompt,
  imageSize,
  animate,
  fullscreen,
  onChange,
  video = false,
}: AnimationProps) {
  const [image, setImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function generateImage() {
      const imageDescription = await getGroqCompletion(
        prompt,
        64,
        systemPrompt
      );
      const url = await generateImageFal(imageDescription, imageSize);
      return url;
    }

    async function generateVideo(url: string) {
      const videoUrl = await generateVideoFal(url, 4);
      return videoUrl;
    }

    if (animate === 0) {
      generateImage().then((url) => {
        setImage(url);
        setVideoUrl(null);
        console.log("generating video");
        if (video && url)
          generateVideo(url).then((videoUrl) => {
            console.log("got video", videoUrl);
            setVideoUrl(videoUrl);
          });
      });
    } else {
      const interval = setInterval(async () => {
        const url = await generateImage();
        setImage(url); // Set new image
        if (onChange) onChange(url);
      }, animate);

      return () => clearInterval(interval); // Cleanup
    }
  }, [prompt, animate, systemPrompt, imageSize, onChange, video]);

  return (
    <Blend
      component={
        videoUrl ? (
          <video
            poster={image ?? ""}
            src={videoUrl}
            autoPlay
            className="w-full h-full object-cover"
            muted
            loop
          />
        ) : (
          <img className="w-full  h-full  object-cover" src={image ?? ""} />
        )
      }
      fullscreen={fullscreen}
    />
  );
}
