import React from "react";
import {
  AbsoluteFill,
  Easing,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AREA_SEGURA, IDENTIDADE } from "../config";

// Prévia de 5 s para escolher o estilo. Fundo provisório (sem vídeo dela ainda).
// Tempos de fala de exemplo: na edição real vêm da transcrição.

export type Opcao = "A" | "B" | "C";

type Palavra = { texto: string; inicio: number; chave?: boolean };

const FALA: Palavra[] = [
  { texto: "Você", inicio: 0.4 },
  { texto: "pode", inicio: 0.7 },
  { texto: "ir", inicio: 1.0 },
  { texto: "muito", inicio: 1.3 },
  { texto: "mais", inicio: 1.65 },
  { texto: "longe", inicio: 2.0, chave: true },
  { texto: "do", inicio: 2.9 },
  { texto: "que", inicio: 3.1 },
  { texto: "imagina", inicio: 3.35, chave: true },
];
const FIM = 4.7;
const TITULO = "SEU PRÓXIMO PASSO";

const { legenda: BRANCO, destaque: VERMELHO } = IDENTIDADE.paleta;
const FONTE = IDENTIDADE.fontes.legenda;

// Brilho claro sutil atrás da letra vermelha, para ler em qualquer fundo
const BRILHO_CHAVE =
  "0 0 26px rgba(255,255,255,1), 0 0 12px rgba(255,255,255,1), 0 0 4px rgba(255,255,255,1)";
const SOMBRA_BRANCA = "0 3px 14px rgba(0,0,0,0.45)";

const grupos = (tamanho: number) => {
  const out: Palavra[][] = [];
  for (let i = 0; i < FALA.length; ) {
    // palavra-chave fecha o grupo (fica por último, maior)
    const g: Palavra[] = [];
    while (i < FALA.length && g.length < tamanho) {
      g.push(FALA[i]);
      i++;
      if (g[g.length - 1].chave) break;
    }
    out.push(g);
  }
  return out;
};

const Fundo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(180deg, #d9c8b6 0%, #c7b09a 55%, #a78b74 100%)",
        transform: `scale(${zoom})`,
      }}
    >
      {/* silhueta provisória no lugar do vídeo */}
      <div
        style={{
          position: "absolute",
          left: 540 - 110,
          top: 560,
          width: 220,
          height: 260,
          borderRadius: "50%",
          background: "#4a3632",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 540 - 330,
          top: 820,
          width: 660,
          height: 1200,
          borderRadius: "330px 330px 0 0",
          background: "#4a3632",
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Títulos (gancho, 0–2 s) ----------
const Titulo: React.FC<{ opcao: Opcao }> = ({ opcao }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame, fps, config: { damping: 14 } });
  const sai = interpolate(frame, [1.75 * fps, 2 * fps], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const base: React.CSSProperties = {
    position: "absolute",
    top: AREA_SEGURA.topo + 90,
    left: AREA_SEGURA.laterais + 40,
    right: AREA_SEGURA.laterais + 40,
    textAlign: "center",
    fontFamily: FONTE,
    opacity: sai,
  };
  if (opcao === "A") {
    return (
      <div
        style={{
          ...base,
          fontWeight: 900,
          fontSize: 96,
          lineHeight: 1,
          color: BRANCO,
          textShadow: SOMBRA_BRANCA,
          transform: `translateY(${(1 - entra) * -40}px)`,
        }}
      >
        {TITULO}
      </div>
    );
  }
  if (opcao === "B") {
    return (
      <div style={{ ...base, transform: `scale(${entra})` }}>
        <span
          style={{
            display: "inline-block",
            background: VERMELHO,
            color: BRANCO,
            fontWeight: 900,
            fontSize: 92,
            padding: "14px 30px",
            lineHeight: 1,
          }}
        >
          {TITULO}
        </span>
      </div>
    );
  }
  // C — editorial
  return (
    <div style={{ ...base, opacity: Math.min(entra, sai) }}>
      <div
        style={{
          color: BRANCO,
          fontWeight: 500,
          fontSize: 40,
          letterSpacing: 14,
          textShadow: SOMBRA_BRANCA,
        }}
      >
        SEU PRÓXIMO
      </div>
      <div
        style={{
          margin: "18px auto",
          width: interpolate(entra, [0, 1], [0, 220]),
          height: 3,
          background: BRANCO,
        }}
      />
      <div
        style={{
          color: BRANCO,
          fontWeight: 800,
          fontStyle: "italic",
          fontSize: 120,
          lineHeight: 1,
          textShadow: SOMBRA_BRANCA,
        }}
      >
        passo
      </div>
    </div>
  );
};

// ---------- Legendas ----------
const PalavraAnimada: React.FC<{
  p: Palavra;
  opcao: Opcao;
}> = ({ p, opcao }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame; // já é relativo ao início da palavra (Sequence)
  const s = spring({ frame: local, fps, config: { damping: 12, mass: 0.6 } });
  if (local < 0) return null;

  const tamanhoBase = opcao === "B" ? 130 : 72;
  const tamanho = p.chave ? tamanhoBase * (opcao === "B" ? 1.25 : 1.6) : tamanhoBase;
  const peso = p.chave ? 900 : opcao === "C" ? 500 : 800;

  let transform = "";
  let opacity = 1;
  if (opcao === "A") {
    transform = `scale(${interpolate(s, [0, 1], [0.6, 1])})`;
  } else if (opcao === "B") {
    transform = `scale(${interpolate(s, [0, 1], [1.5, 1])})`;
    opacity = interpolate(local, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  } else {
    const t = interpolate(local, [0, 8], [0, 1], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
    transform = `translateY(${(1 - t) * 30}px)`;
    opacity = t;
  }

  return (
    <span
      style={{
        display: "inline-block",
        margin: "0 12px",
        fontFamily: FONTE,
        fontWeight: peso,
        fontStyle: opcao === "C" && p.chave ? "italic" : "normal",
        fontSize: tamanho,
        lineHeight: 1.05,
        color: p.chave ? VERMELHO : BRANCO,
        textShadow: p.chave ? BRILHO_CHAVE : SOMBRA_BRANCA,
        textTransform: opcao === "B" ? "uppercase" : "none",
        transform,
        opacity,
      }}
    >
      {p.texto}
    </span>
  );
};

const Legendas: React.FC<{ opcao: Opcao }> = ({ opcao }) => {
  const { fps } = useVideoConfig();
  const lista = grupos(opcao === "B" ? 1 : 3);
  return (
    <>
      {lista.map((g, i) => {
        const de = Math.round(g[0].inicio * fps);
        const ate = Math.round((lista[i + 1]?.[0].inicio ?? FIM) * fps);
        return (
          <Sequence key={i} from={de} durationInFrames={ate - de} layout="none">
            <div
              style={{
                position: "absolute",
                left: AREA_SEGURA.laterais + 30,
                right: AREA_SEGURA.laterais + 30,
                // B: centro da tela; A/C: terço inferior, acima da área dos botões
                top: opcao === "B" ? 1060 : undefined,
                bottom: opcao === "B" ? undefined : AREA_SEGURA.base + 330,
                textAlign: "center",
              }}
            >
              {g.map((p) => (
                <Sequence
                  key={p.texto}
                  from={Math.round(p.inicio * fps) - de}
                  layout="none"
                >
                  <PalavraAnimada p={p} opcao={opcao} />
                </Sequence>
              ))}
            </div>
          </Sequence>
        );
      })}
    </>
  );
};

export const PreviaEstilo: React.FC<{
  opcao: Opcao;
  titulo?: Opcao;
  legenda?: Opcao;
}> = ({ opcao, titulo = opcao, legenda = opcao }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Fundo />
      <Sequence durationInFrames={2 * fps} layout="none">
        <Titulo opcao={titulo} />
      </Sequence>
      <Legendas opcao={legenda} />
      {/* whoosh na entrada do gancho, click em cada palavra-chave */}
      <Audio src={staticFile("sons/whoosh.wav")} volume={0.6} />
      {FALA.filter((p) => p.chave).map((p) => (
        <Sequence key={p.texto} from={Math.round(p.inicio * fps)} layout="none">
          <Audio src={staticFile("sons/click.wav")} volume={0.8} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
