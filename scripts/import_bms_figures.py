#!/usr/bin/env python3
"""Extrait des figures authentiques du rapport BMS accessible sur Google Drive.

Ce script ne génère aucun schéma fictif et conserve les numéros de pages de la
version originale (27 pages). Il extrait uniquement des captures exactes de ces
pages pour les afficher au fil de l'étude technique React.
"""
from __future__ import annotations

from pathlib import Path
import tempfile
import sys

import fitz
import gdown
from PIL import Image

FILE_ID = "1DUZowOv8VdRwOAyJHNs0hD_KosBUeGAz"
PAGES = (6, 9, 10, 11, 14, 15, 16, 17)
OUTPUT = Path("public/assets/bms")
EXPECTED_PAGES = 27


def main() -> int:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="bms-report-") as temp:
        pdf_file = Path(temp) / "rapport_bms_original.pdf"
        print("Téléchargement du rapport BMS depuis Google Drive (source publique par lien)...")
        result = gdown.download(id=FILE_ID, output=str(pdf_file), quiet=False, use_cookies=False)
        if not result or not pdf_file.is_file():
            raise RuntimeError("Téléchargement Drive impossible ; vérifier le partage du rapport.")
        if not pdf_file.read_bytes()[:5] == b"%PDF-":
            raise RuntimeError("La réponse de Drive n'est pas un fichier PDF.")
        document = fitz.open(str(pdf_file))
        if len(document) != EXPECTED_PAGES:
            raise RuntimeError(
                f"PDF inattendu : {len(document)} pages, au lieu de {EXPECTED_PAGES}."
            )
        for page_number in PAGES:
            page = document[page_number - 1]
            raster = page.get_pixmap(matrix=fitz.Matrix(1.45, 1.45), alpha=False)
            img = Image.frombytes("RGB", (raster.width, raster.height), raster.samples)
            target = OUTPUT / f"rapport-page-{page_number:02d}.webp"
            img.save(target, "WEBP", quality=82, method=6)
            print(f"Capture authentique page {page_number:02d}: {target} ({target.stat().st_size:,} octets)")
    print("Figures BMS extraites : ", len(PAGES))
    return 0


if __name__ == "__main__":
    sys.exit(main())
