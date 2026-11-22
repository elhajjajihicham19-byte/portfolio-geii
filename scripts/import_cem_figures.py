#!/usr/bin/env python3
"""Extrait les figures exactes du TP CEM BUT3 sans retouche des données.

Source : public/documents/TP-CEM-Hicham-El-Hajjaji.pdf
Les coordonnées des figures sont relevées sur les pages du PDF de 34 pages.
Les sorties webp sont des captures fidèles des schémas et simulations PSIM.
"""
from pathlib import Path
import sys

import fitz
from PIL import Image

SOURCE = Path("public/documents/TP-CEM-Hicham-El-Hajjaji.pdf")
DEST = Path("public/assets/cem")
EXPECTED_PAGES = 34
# Format : nom -> (numéro de page 1-based, rectangle en points PDF)
FIGURES = {
    "filtre-accorde-schema": (20, (32, 628, 564, 773)),
    "filtre-accorde-chronogrammes": (21, (32, 187, 564, 443)),
    "filtre-accorde-spectres": (22, (32, 338, 564, 780)),
    "pfc-schema-boost": (24, (59, 320, 531, 451)),
    "pfc-commande-hysteresis": (26, (50, 566, 533, 731)),
    "pfc-bande-hysteresis": (28, (32, 362, 564, 618)),
    "pfc-chronogrammes": (29, (32, 91, 564, 336)),
}


def main() -> int:
    if not SOURCE.is_file():
        raise FileNotFoundError(f"PDF de compte rendu absent : {SOURCE}")
    with fitz.open(SOURCE) as document:
        if len(document) != EXPECTED_PAGES:
            raise ValueError(f"Document inattendu : {len(document)} pages au lieu de {EXPECTED_PAGES}")
        if "Utilisation de filtres" not in document[19].get_text() or "structure PFC" not in document[26].get_text():
            raise ValueError("Les sections filtre accordé/PFC ne correspondent pas au PDF attendu.")
        DEST.mkdir(parents=True, exist_ok=True)
        for name, (number, coordinates) in FIGURES.items():
            page = document[number - 1]
            rect = fitz.Rect(*coordinates)
            if not page.rect.contains(rect):
                raise ValueError(f"Région hors page pour {name}")
            pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0), clip=rect, alpha=False)
            image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            filepath = DEST / f"{name}.webp"
            image.save(filepath, "WEBP", quality=85, method=6)
            print(f"{name}: page {number}, {filepath.stat().st_size:,} octets")
    print(f"{len(FIGURES)} extraits PSIM copiés fidèlement depuis le TP CEM.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
