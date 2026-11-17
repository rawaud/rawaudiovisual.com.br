import { Composition } from "remotion";
import { Reels } from "./Reels";
import { PreviaEstilo } from "./estilos/Previa";
import { ALTURA, FPS, LARGURA } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
    {(["A", "B", "C"] as const).map((opcao) => (
      <Composition
        key={opcao}
        id={`Estilo${opcao}`}
        component={PreviaEstilo}
        defaultProps={{ opcao }}
        durationInFrames={FPS * 5}
        fps={FPS}
        width={LARGURA}
        height={ALTURA}
      />
    ))}
    <Composition
      id="Reels"
      component={Reels}
      durationInFrames={FPS * 5}
      fps={FPS}
      width={LARGURA}
      height={ALTURA}
    />
    </>
  );
};
