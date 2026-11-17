# Identidade visual

## 1. Paleta
- **Legendas:** `#FFFFFF` (branco)
- **Destaque / palavras principais:** `#5F0405` (vermelho escuro)
- Cor para telas lisas (respiros): a definir

## 2. Fontes
- **Montserrat para tudo** (Google Fonts): títulos e legendas.
- Variação vem do peso/tamanho (ex.: títulos e palavras-chave mais pesados, conectivos mais leves).

## 3. Legenda
- **Dinâmica, de 1 a 3 palavras por vez**, entrando na hora exata em que cada palavra é falada.
- Branca (`#FFFFFF`), Montserrat.
- Palavras-chave com a **letra em vermelho escuro** (`#5F0405`). Para continuar legível em cenas escuras, usar uma sombra/contorno clara e sutil atrás da letra vermelha (aprovar no quadro parado).
- **Palavras-chave ganham efeito sonoro** no momento em que aparecem (efeitos em `assets/sons/`).
- Posição: terço inferior, sempre dentro da área segura (acima dos 126 px da base, sem tapar o rosto).

## 4. Ritmo
- Formato principal: **vídeo falado**. A maior parte do tempo é a pessoa falando para a câmera.
- B-roll e inserções (prints, palavras gigantes, cartões) só como apoio, curtos e pontuais, quando pedidos.
- Para não ficar parado: proposta de cortes secos para tirar pausas e leves aproximações (zoom) em frases importantes — sempre mostrar em prévia antes de fixar.

## 5. Som
- **Música de fundo bem baixinha**, instrumental, sem letra, só para dar clima por baixo da voz (a voz sempre em primeiro plano).
- **Efeitos sonoros nas palavras-chave**, no momento em que a palavra aparece. Preferidos: **whoosh** e **click**. Arquivos em `assets/sons/`; se não houver, sugerir opções gratuitas de uso livre para ela ouvir e aprovar.
- Música e efeitos sempre aprovados antes do vídeo final.

## 6. Tom de voz
- **Inspiradora:** motiva e mostra o que é possível.
- Vale para ganchos, textos na tela e sugestões de roteiro.

## 7. Estilo escolhido (aprovado)
- **Gancho:** opção B: título branco em caixa alta, Montserrat Black, numa tarja vermelho escuro (`#5F0405`), no topo, dentro da área segura, nos 2 primeiros segundos. Entra com um pulo, com **whoosh**.
- **Legenda:** opção A: até 3 palavras no terço inferior, branca, Montserrat ExtraBold. Entra com um pequeno pulo.
- **Palavra-chave:** opção B: aparece **sozinha**, em **CAIXA ALTA**, grande, Montserrat Black, vermelho escuro com brilho branco, na altura do peito (centro da tela). Entra "caindo" do grande para o normal, com **click**.
- Código: `src/estilos/Previa.tsx` (composição `EstiloEscolhido`).
- **Legenda:** linha de até 3 palavras que aparece **inteira de uma vez**, tamanho constante (pedido no Reels 01). Substitui o "dinâmica palavra por palavra" acima.
- **Gancho:** a frase que já está no gancho não recebe legenda embaixo; o gancho fica na tela até o primeiro corte.
- **Não usar palavra em tela cheia** (fundo vermelho ocupando a tela) no pedido final. Ela não gostou; o CTA fica como legenda normal.
