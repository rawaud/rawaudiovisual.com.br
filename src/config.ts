// Formato fixo do projeto: Reels vertical 9:16
export const LARGURA = 1080;
export const ALTURA = 1920;
export const FPS = 30;

// Área segura do Instagram (px em 1080x1920).
// Nada importante (rosto, legenda, texto, adesivo) fora desta área.
export const AREA_SEGURA = {
  topo: 154,
  base: 126,
  laterais: 34,
} as const;

// Identidade visual — será preenchida depois das perguntas de identidade.
// Ver referencias/identidade.md
export const IDENTIDADE = {
  paleta: {
    fundo: "#5F0405", // provisório para telas lisas, até a definição
    legenda: "#FFFFFF",
    destaque: "#5F0405",
  },
  fontes: {
    titulo: "serif",
    legenda: "sans-serif",
  },
} as const;
