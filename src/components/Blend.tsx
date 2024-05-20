import { ReactNode, useEffect, useState } from "react";

type BlendImageProps = {
  component: ReactNode;
  fullscreen: boolean;
};

//blends and animate an new component over the top of any previously rendered component
export default function Blend({ component, fullscreen }: BlendImageProps) {
  const [currentComponent, setCurrentComponent] = useState<ReactNode | null>(
    null
  );
  const [nextComponent, setNextComponent] = useState<ReactNode | null>(null);

  useEffect(() => {
    setNextComponent(component);
    const timeout = setTimeout(() => {
      setCurrentComponent(component);
      setNextComponent(null);
    }, 1000); // Delay for the fade effect to complete
    return () => clearTimeout(timeout);
  }, [component]);

  return (
    <div
      className={`${
        fullscreen
          ? "fixed top-0 left-0 -z-50 min-w-[100vw] min-h-[100vh]"
          : `relative max-w-full w-[1024px] h-[600px] overflow-hidden`
      }`}
    >
      {currentComponent && (
        <div
          className={`${
            fullscreen && "absolute top-0 left-0"
          } w-full h-full animate-scale `}
        >
          <div
            className={`${fullscreen && "absolute top-0 left-0"} w-full h-full`}
          >
            {currentComponent}
          </div>
          <div
            className={`${
              fullscreen && "absolute top-0 left-0"
            } w-full h-full transition-opacity duration-1000 ease-in-out`}
            style={{
              opacity: nextComponent ? 1 : 0,
              zIndex: nextComponent ? "10" : "-10",
            }}
          >
            {nextComponent}
          </div>
        </div>
      )}
    </div>
  );
}

export function BlendImage({
  src,
  fullscreen,
}: {
  src: string;
  fullscreen: boolean;
}) {
  return (
    <Blend
      component={<img className="w-full  h-full  object-cover" src={src} />}
      fullscreen={fullscreen}
    />
  );
}
