import React from "react";
import {
  AbsoluteFill,
  Audio,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { AREA_SEGURA, IDENTIDADE } from "../config";
import dados from "./dados.json";

// Reels 01 — tudo alinhado pela fala: tempos vêm de dados.json
// (gerado por trabalho/reels-01/montar_dados.py a partir da transcrição).

const VIDEO = staticFile("trabalho/reels01.mp4");
const GANCHO = "EU NÃO VENDO MAIS SÓ UM POST";
const DURACAO_GANCHO = 2; // s

// Palavras-chave aprovadas (palavra + segundo aproximado no vídeo final)
const CHAVES: { palavra: string; aprox: number; telaCheia?: boolean }[] = [
  { palavra: "post", aprox: 2 },
  { palavra: "resultado", aprox: 13 },
  { palavra: "faturamento", aprox: 18 },
  { palavra: "isolado", aprox: 20 },
  { palavra: "estratégia", aprox: 30 },
  { palavra: "objetivo", aprox: 37 },
  { palavra: "direct", aprox: 43, telaCheia: true },
];

const { legenda: BRANCO, destaque: VERMELHO } = IDENTIDADE.paleta;
const FONTE = IDENTIDADE.fontes.legenda;
const BRILHO_CHAVE =
  "0 0 26px rgba(255,255,255,1), 0 0 12px rgba(255,255,255,1), 0 0 4px rgba(255,255,255,1)";
const SOMBRA_BRANCA =
  "0 2px 3px rgba(0,0,0,0.6), 0 3px 18px rgba(0,0,0,0.7), 0 0 6px rgba(0,0,0,0.55)";

type Palavra = {
  texto: string;
  inicio: number;
  fim: number;
  chave?: boolean;
  telaCheia?: boolean;
};

const limpar = (t: string) => t.toLowerCase().replace(/[^\p{L}]/gu, "");

const PALAVRAS: Palavra[] = (() => {
  const ps: Palavra[] = dados.palavras.map((p) => ({ ...p }));
  for (const c of CHAVES) {
    let melhor = -1;
    ps.forEach((p, i) => {
      if (limpar(p.texto) !== c.palavra) return;
      if (melhor < 0 || Math.abs(p.inicio - c.aprox) < Math.abs(ps[melhor].inicio - c.aprox))
        melhor = i;
    });
    if (melhor >= 0) {
      ps[melhor].chave = true;
      ps[melhor].telaCheia = c.telaCheia;
    }
  }
  return ps;
})();

// Grupos de até 3 palavras; quebra no fim de frase; palavra-chave sempre sozinha
const GRUPOS: Palavra[][] = (() => {
  const out: Palavra[][] = [];
  let g: Palavra[] = [];
  const fecha = () => {
    if (g.length) out.push(g);
    g = [];
  };
  for (const p of PALAVRAS) {
    if (p.chave) {
      fecha();
      out.push([p]);
      continue;
    }
    g.push(p);
    if (g.length === 3 || /[.,?!:]$/.test(p.texto)) fecha();
  }
  fecha();
  return out;
})();

const semPontuacao = (t: string) => t.replace(/[.,?!:]+$/, "");

// ---------- Vídeo: segmentos sem as pausas, alternando plano normal / mais próximo ----------
const Segmentos: React.FC = () => {
  const { fps } = useVideoConfig();
  let acumulado = 0;
  return (
    <>
      {dados.segmentos.map((s, i) => {
        const de = Math.round(acumulado * fps);
        acumulado += s.ate - s.de;
        const ate = Math.round(acumulado * fps);
        const zoom = i % 2 === 0 ? 1 : 1.18;
        return (
          <Sequence key={i} from={de} durationInFrames={ate - de}>
            <AbsoluteFill
              style={{ transform: `scale(${zoom})`, transformOrigin: "50% 28%" }}
            >
              <OffthreadVideo src={VIDEO} trimBefore={Math.round(s.de * fps)} />
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </>
  );
};

// ---------- Gancho (estilo B) ----------
const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entra = spring({ frame, fps, config: { damping: 14 } });
  const sai = interpolate(
    frame,
    [(DURACAO_GANCHO - 0.25) * fps, DURACAO_GANCHO * fps],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <div
      style={{
        position: "absolute",
        top: AREA_SEGURA.topo + 90,
        left: AREA_SEGURA.laterais + 40,
        right: AREA_SEGURA.laterais + 40,
        textAlign: "center",
        opacity: sai,
        transform: `scale(${entra})`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          background: VERMELHO,
          color: BRANCO,
          fontFamily: FONTE,
          fontWeight: 900,
          fontSize: 84,
          padding: "16px 32px",
          lineHeight: 1.08,
        }}
      >
        {GANCHO}
      </span>
    </div>
  );
};

// ---------- Legenda (estilo A) e palavra-chave (estilo B) ----------
const PalavraLegenda: React.FC<{ p: Palavra }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  return (
    <span
      style={{
        display: "inline-block",
        margin: "0 11px",
        fontFamily: FONTE,
        fontWeight: 800,
        fontSize: 72,
        lineHeight: 1.1,
        color: BRANCO,
        textShadow: SOMBRA_BRANCA,
        transform: `scale(${interpolate(s, [0, 1], [0.6, 1])})`,
      }}
    >
      {semPontuacao(p.texto)}
    </span>
  );
};

const PalavraChave: React.FC<{ p: Palavra }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12, mass: 0.6 } });
  const opacidade = interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" });
  // palavra longa diminui para caber dentro da área segura
  const texto = semPontuacao(p.texto);
  const tamanho = Math.min(150, Math.floor(950 / (texto.length * 0.8)));
  return (
    <div
      style={{
        position: "absolute",
        left: AREA_SEGURA.laterais + 20,
        right: AREA_SEGURA.laterais + 20,
        top: 1060,
        textAlign: "center",
        fontFamily: FONTE,
        fontWeight: 900,
        fontSize: tamanho,
        lineHeight: 1,
        color: VERMELHO,
        textShadow: BRILHO_CHAVE,
        textTransform: "uppercase",
        transform: `scale(${interpolate(s, [0, 1], [1.5, 1])})`,
        opacity: opacidade,
      }}
    >
      {texto}
    </div>
  );
};

// Pedido final: palavra ocupa a tela inteira por um instante (respiro)
const TelaCheia: React.FC<{ p: Palavra }> = ({ p }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 13 } });
  return (
    <AbsoluteFill
      style={{
        backgroundColor: VERMELHO,
        justifyContent: "center",
        alignItems: "center",
        opacity: interpolate(frame, [0, 3], [0, 1], { extrapolateRight: "clamp" }),
      }}
    >
      <div
        style={{
          fontFamily: FONTE,
          fontWeight: 900,
          fontSize: 210,
          color: BRANCO,
          textTransform: "uppercase",
          transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`,
        }}
      >
        {semPontuacao(p.texto)}
      </div>
    </AbsoluteFill>
  );
};

const Legendas: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      {GRUPOS.map((g, i) => {
        const de = Math.round(g[0].inicio * fps);
        const proximo = GRUPOS[i + 1]?.[0].inicio ?? dados.duracao;
        const ate = Math.max(de + 1, Math.round(proximo * fps));
        const unica = g.length === 1 && g[0].chave;
        return (
          <Sequence key={i} from={de} durationInFrames={ate - de} layout="none">
            {unica ? (
              g[0].telaCheia ? (
                <TelaCheia p={g[0]} />
              ) : (
                <PalavraChave p={g[0]} />
              )
            ) : (
              <div
                style={{
                  position: "absolute",
                  left: AREA_SEGURA.laterais + 30,
                  right: AREA_SEGURA.laterais + 30,
                  bottom: AREA_SEGURA.base + 330,
                  textAlign: "center",
                }}
              >
                {g.map((p, k) => (
                  <Sequence
                    key={k}
                    from={Math.round(p.inicio * fps) - de}
                    layout="none"
                  >
                    <PalavraLegenda p={p} />
                  </Sequence>
                ))}
              </div>
            )}
          </Sequence>
        );
      })}
    </>
  );
};

const Sons: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <>
      <Audio src={staticFile("sons/whoosh.wav")} volume={0.5} />
      {PALAVRAS.filter((p) => p.chave).map((p, i) => (
        <Sequence key={i} from={Math.round(p.inicio * fps)} layout="none">
          <Audio src={staticFile("sons/click.wav")} volume={0.7} />
        </Sequence>
      ))}
    </>
  );
};

export const Reels01: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: "hidden" }}>
      <Segmentos />
      <Legendas />
      <Sequence durationInFrames={DURACAO_GANCHO * fps} layout="none">
        <Gancho />
      </Sequence>
      <Sons />
    </AbsoluteFill>
  );
};

export const DURACAO_REELS01 = dados.duracao;
