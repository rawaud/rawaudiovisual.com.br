import { Composition } from "remotion";
import { Reels } from "./Reels";
import { ALTURA, FPS, LARGURA } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Reels"
      component={Reels}
      durationInFrames={FPS * 5}
      fps={FPS}
      width={LARGURA}
      height={ALTURA}
    />
  );
};
