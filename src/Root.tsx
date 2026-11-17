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
    {/* Estilo escolhido: gancho do B + legenda do A + palavra-chave do B */}
    <Composition
      id="EstiloEscolhido"
      component={PreviaEstilo}
      defaultProps={{ opcao: "A" as const, titulo: "B" as const, legenda: "A" as const, chave: "B" as const }}
      durationInFrames={FPS * 5}
      fps={FPS}
      width={LARGURA}
      height={ALTURA}
    />
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
