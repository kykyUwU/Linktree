#!/usr/bin/env python3
"""
Génère la version hors ligne du site : UN seul fichier HTML qui contient tout
(styles, scripts, CV, PDF, musiques). On l'ouvre en double-cliquant, sans internet.

Usage (depuis le dossier Linktree) :
    python3 tools/build_offline.py

À relancer après chaque modification du contenu, avant de pousser sur GitHub.
Met aussi à jour les numéros de version (?v=...) des CSS/JS dans les pages.
"""
import base64
import json
import mimetypes
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "files" / "Kylian_Maton_offline.html"
CF_LIMIT = 25 * 1024 * 1024  # limite Cloudflare Pages par fichier


def read(rel):
    return (ROOT / rel).read_text(encoding="utf-8")


def data_uri(rel):
    path = ROOT / rel
    mime = mimetypes.guess_type(path.name)[0] or "application/octet-stream"
    return f"data:{mime};base64," + base64.b64encode(path.read_bytes()).decode()


def main_block(html):
    m = re.search(r"<main class=\"content\">.*?</main>", html, re.S)
    return m.group(0)


def title_of(html):
    return re.search(r"<title>(.*?)</title>", html, re.S).group(1)


# --- Versionne CSS/JS (?v=empreinte) : les navigateurs prennent la nouvelle version tout de suite ---
import hashlib
def stamp(html):
    def rep(m):
        path = m.group(2)
        h = hashlib.md5((ROOT / path.lstrip("/")).read_bytes()).hexdigest()[:8]
        return f'{m.group(1)}{path}?v={h}"'
    return re.sub(r'((?:src|href)=")(/assets/(?:js|css)/[^"?]+)(?:\?v=[0-9a-f]+)?"', rep, html)

for page in ["index.html", "cv/index.html"]:
    f = ROOT / page
    f.write_text(stamp(f.read_text(encoding="utf-8")), encoding="utf-8")

home = read("index.html")
cv = read("cv/index.html")

# --- Fichiers embarqués : tout ce qui est référencé dans data.js (musique, PDF, images) ---
data_js = read("assets/js/data.js")
refs = sorted(set(re.findall(r"[\"'](assets/(?:music|files|img)/[^\"']+)[\"']", data_js)))
assets = {}
for ref in refs:
    if (ROOT / ref).is_file() and ref != str(OUT.relative_to(ROOT)):
        assets[ref] = data_uri(ref)

# Les deux "pages", rendues par main.js sans rechargement
cv_page = f'<html><head><title>{title_of(cv)}</title></head><body class="cv-page">{main_block(cv)}</body></html>'
home_page = f'<html><head><title>{title_of(home)}</title></head><body>{main_block(home)}</body></html>'
offline = {"pages": {"/": home_page, "/cv/": cv_page}, "assets": assets}

out = home
# Pas de bouton "version hors ligne" dans la version hors ligne
out = re.sub(r"\s*<!-- offline-btn -->.*?<!-- /offline-btn -->", "", out, flags=re.S)

# Pas de statistiques dans la version hors ligne
out = re.sub(r"\s*<!-- Cloudflare Web Analytics -->.*?<!-- End Cloudflare Web Analytics -->", "", out, flags=re.S)

# CSS en ligne
def inline_css(m):
    return "<style>\n" + read(m.group(1).lstrip("/")) + "\n</style>"
out = re.sub(r'<link rel="stylesheet" href="(/assets/css/[^"?]+)(?:\?v=[0-9a-f]+)?">', inline_css, out)

# Scripts en ligne (dans le même ordre), précédés des données hors ligne
scripts = re.findall(r'<script defer src="(/assets/js/[^"?]+)(?:\?v=[0-9a-f]+)?"></script>', out)
out = re.sub(r'\s*<script defer src="/assets/js/[^"]+"></script>', "", out)
payload = json.dumps(offline, ensure_ascii=False).replace("</", "<\\/")
inline = "<script>window.OFFLINE = " + payload + ";</script>\n"
for src in scripts:
    inline += "  <script>\n" + read(src.lstrip("/")).replace("</script", "<\\/script") + "\n  </script>\n"
out = out.replace("</body>", inline + "</body>")

OUT.write_text(out, encoding="utf-8")
size = OUT.stat().st_size
print(f"OK → {OUT.relative_to(ROOT)}  ({size / 1024 / 1024:.1f} Mo, {len(assets)} fichiers embarqués)")
if size > CF_LIMIT:
    print("⚠ Plus de 25 Mo : Cloudflare Pages refusera ce fichier. Retire des musiques ou compresse-les.")
