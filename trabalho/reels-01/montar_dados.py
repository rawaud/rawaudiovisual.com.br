"""Gera src/reels01/dados.json a partir da transcrição: cortes das pausas + palavras
com tempos no vídeo final. Rodar de novo se a narração for regravada."""
import json, subprocess, re, sys
ORIG = "originais/IMG_8360.MOV"
trans = json.load(open("originais/IMG_8360.transcricao.json"))
words = [dict(i=w[0], f=w[1], t=w[2].strip()) for s in trans for w in s["words"]]

# Correções aprovadas pela usuária (texto da narração)
def corrigir(ws):
    out = []
    i = 0
    while i < len(ws):
        t = ws[i]["t"]; low = re.sub(r"[^\wà-ú]", "", t.lower())
        if low == "artzinha": ws[i]["t"] = "artezinha"
        elif low == "dos" and i+1 < len(ws) and ws[i+1]["t"].startswith("lentes"):
            out.append(dict(ws[i], t="das")); out.append(dict(ws[i+1], t="clientes")); i += 2; continue
        elif low == "fatura" and [w["t"].strip(".,") for w in ws[i:i+4]] == ["fatura","mento","a","mente"]:
            out.append(dict(i=ws[i]["i"], f=ws[i]["f"], t="o"))
            out.append(dict(i=ws[i]["f"], f=ws[i+1]["f"], t="faturamento"))
            out.append(dict(i=ws[i+2]["i"], f=ws[i+3]["f"], t="aumente."))
            i += 4; continue
        elif low == "chamam": ws[i]["t"] = "chama"
        elif low == "whatsapp": ws[i]["t"] = "WhatsApp" + t[len("whatsapp"):]
        elif low == "para" and i+1 < len(ws) and ws[i+1]["t"].startswith("pessoa"): ws[i]["t"] = "pra"
        out.append(ws[i]); i += 1
    return out
words = corrigir(words)

# Pausas detectadas no áudio -> manter 0,1 s de cada lado (pausa final ~0,2 s)
r = subprocess.run(["ffmpeg","-hide_banner","-i",ORIG,"-af","silencedetect=noise=-35dB:d=0.35","-vn","-f","null","-"],capture_output=True,text=True).stderr
st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", r)]
en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", r)]
dur = float(subprocess.run(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",ORIG],capture_output=True,text=True).stdout)
FOLGA = 0.1
cortes = [(a+FOLGA, b-FOLGA) for a, b in zip(st, en)]
seg = []; ini = 0.0
for a, b in cortes:
    seg.append([round(ini,3), round(a,3)]); ini = b
if any(w["i"] >= ini for w in words): seg.append([round(ini,3), round(dur,3)])

def mapear(t):
    acc = 0.0
    for a, b in seg:
        if t < a: return round(acc, 3)
        if t <= b: return round(acc + t - a, 3)
        acc += b - a
    return round(acc, 3)

saida = dict(
    origem=ORIG,
    segmentos=[dict(de=a, ate=b) for a, b in seg],
    duracao=round(sum(b-a for a, b in seg), 3),
    palavras=[dict(texto=w["t"], inicio=mapear(w["i"]), fim=mapear(w["f"])) for w in words],
)
json.dump(saida, open("src/reels01/dados.json","w"), ensure_ascii=False, indent=1)
print("duração final:", saida["duracao"], "s; segmentos:", seg)
print(" ".join(w["texto"] for w in saida["palavras"]))
