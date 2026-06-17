"""Genererar tilläggets ikoner (16/48/128 px) till icons/.

Designen: en bild-/foto-ikon på gul highlighter-bakgrund — knyter an till
funktionen (gulmarkerar bild-ikoner). Ritas i 4x och nedskalas för skärpa.

Kör: python make_icons.py
Behövs bara när ikonen ska ändras; resultatet (icons/*.png) committas.
"""

import os
from PIL import Image, ImageDraw

YELLOW = (255, 235, 59, 255)      # #ffeb3b
ORANGE = (249, 168, 37, 255)      # #f9a825
DARK = (40, 33, 10, 255)          # mörk glyf
PHOTO = (255, 254, 245, 255)      # nästan vit "bild"
OUT_DIR = os.path.join(os.path.dirname(__file__), "icons")


def draw_icon(size):
    s = size * 4  # superscale för antialiasing vid nedskalning
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    # gul bakgrundsruta med orange ram
    m = s * 0.05
    d.rounded_rectangle(
        [m, m, s - m, s - m],
        radius=s * 0.2,
        fill=YELLOW,
        outline=ORANGE,
        width=max(1, int(s * 0.035)),
    )

    # fotoram
    px0, py0, px1, py1 = s * 0.24, s * 0.30, s * 0.76, s * 0.70
    d.rounded_rectangle(
        [px0, py0, px1, py1],
        radius=s * 0.05,
        fill=PHOTO,
        outline=DARK,
        width=max(1, int(s * 0.03)),
    )

    # sol
    r = (px1 - px0) * 0.12
    cx, cy = px0 + (px1 - px0) * 0.28, py0 + (py1 - py0) * 0.30
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ORANGE)

    # berg (två trianglar) längst ner i fotot
    base = py1 - (py1 - py0) * 0.06
    d.polygon(
        [(px0 + (px1 - px0) * 0.12, base),
         (px0 + (px1 - px0) * 0.42, base - (py1 - py0) * 0.42),
         (px0 + (px1 - px0) * 0.62, base)],
        fill=DARK,
    )
    d.polygon(
        [(px0 + (px1 - px0) * 0.46, base),
         (px0 + (px1 - px0) * 0.70, base - (py1 - py0) * 0.30),
         (px0 + (px1 - px0) * 0.90, base)],
        fill=DARK,
    )

    return img.resize((size, size), Image.LANCZOS)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for size in (16, 48, 128):
        draw_icon(size).save(os.path.join(OUT_DIR, f"icon{size}.png"))
        print(f"icons/icon{size}.png")


if __name__ == "__main__":
    main()
