import { AbsoluteFill } from "remotion";
import { AREA_SEGURA, IDENTIDADE } from "./config";

// Composição base (placeholder). As cenas serão montadas aqui,
// alinhadas pela fala, depois da identidade visual e das referências.
export const Reels: React.FC<{ mostrarAreaSegura?: boolean }> = ({
  mostrarAreaSegura = true,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: IDENTIDADE.paleta.fundo }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          fontFamily: IDENTIDADE.fontes.titulo,
          fontSize: 96,
          color: IDENTIDADE.paleta.legenda,
        }}
      >
        Meus Reels
      </AbsoluteFill>
      {mostrarAreaSegura ? (
        <div
          style={{
            position: "absolute",
            top: AREA_SEGURA.topo,
            bottom: AREA_SEGURA.base,
            left: AREA_SEGURA.laterais,
            right: AREA_SEGURA.laterais,
            border: "2px dashed rgba(200,0,0,0.5)",
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
