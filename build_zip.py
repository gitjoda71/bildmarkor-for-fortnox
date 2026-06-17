"""Bygger en zip för uppladdning till Chrome Web Store.

Tar bara med körfilerna – inte docs, byggscript eller git. Versionen läses
från manifest.json.

Kör: python build_zip.py  ->  dist/bildmarkor-for-fortnox-<version>.zip
"""

import json
import os
import zipfile

HERE = os.path.dirname(__file__)

# Filer/mappar som ska med i tillägget (allt annat utelämnas).
INCLUDE_FILES = [
    "manifest.json",
    "highlight.css",
    "content.js",
    "background.js",
    "popup.html",
    "popup.js",
]
INCLUDE_DIRS = ["icons"]


def main():
    with open(os.path.join(HERE, "manifest.json"), encoding="utf-8") as f:
        version = json.load(f)["version"]

    dist = os.path.join(HERE, "dist")
    os.makedirs(dist, exist_ok=True)
    out = os.path.join(dist, f"bildmarkor-for-fortnox-{version}.zip")

    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for name in INCLUDE_FILES:
            z.write(os.path.join(HERE, name), name)
        for d in INCLUDE_DIRS:
            for root, _, files in os.walk(os.path.join(HERE, d)):
                for fn in files:
                    full = os.path.join(root, fn)
                    arc = os.path.relpath(full, HERE)
                    z.write(full, arc)

    print(os.path.relpath(out, HERE), f"({os.path.getsize(out)} bytes)")


if __name__ == "__main__":
    main()
