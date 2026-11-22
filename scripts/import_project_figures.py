#!/usr/bin/env python3
"""Capture les pages des rapports des projets GEII, sans illustrations inventées.

Les pages sont explicitement référencées dans project_figure_plan.json.
Chaque image publiée est une capture intacte d'une page source.
Si l'accès à un fichier est impossible, son image n'est pas déclarée dans le
manifeste : aucun lien d'image cassé n'est donc créé dans le portfolio.
"""
from __future__ import annotations

import json
from pathlib import Path
import re
import sys
import tempfile
import time

import fitz
import gdown
from PIL import Image, ImageChops

BASE = Path("public/assets/studies")
PLAN = Path("scripts/project_figure_plan.json")
MANIFEST = Path("src/projectTechnicalEvidence.json")


def retrieve(file_id: str, path: Path) -> bool:
    for attempt in range(2):
        try:
            result = gdown.download(id=file_id, output=str(path), quiet=True, use_cookies=False)
            if result and path.is_file() and path.stat().st_size > 400 and path.read_bytes()[:5] == b"%PDF-":
                return True
            print(f"Accès ou type de fichier non valide : {file_id} (tentative {attempt + 1})")
        except Exception as error:
            print(f"Téléchargement non disponible pour {file_id}: {error}")
        if attempt == 0:
            time.sleep(2)
    return False


def render_page(page: fitz.Page, output: Path) -> None:
    zoom = 1.55
    pix = page.get_pixmap(matrix=fitz.Matrix(zoom, zoom), alpha=False)
    image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    # Retire seulement les marges blanches uniformes, jamais le contenu
    # des plans ni les annotations. Les schémas larges gagnent en lisibilité.
    baseline = Image.new("RGB", image.size, (255, 255, 255))
    difference = ImageChops.difference(image, baseline).convert("L")
    mask = difference.point(lambda value: 255 if value > 32 else 0)
    bbox = mask.getbbox()
    if bbox:
        left, top, right, bottom = bbox
        if (right-left) > image.width*0.16 and (bottom-top) > image.height*0.12:
            pad = int(max(image.size)*0.024)
            crop = (max(0,left-pad), max(0,top-pad),
                    min(image.width,right+pad), min(image.height,bottom+pad))
            if (crop[2]-crop[0]) < image.width*0.88 or (crop[3]-crop[1]) < image.height*0.88:
                image = image.crop(crop)
    if image.width > 1650:
        size = (1650, round(image.height * 1650 / image.width))
        image = image.resize(size, Image.Resampling.LANCZOS)
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, "WEBP", quality=83, method=5)


def main() -> int:
    configuration = json.loads(PLAN.read_text(encoding="utf-8"))
    manifest: dict[str, list[dict]] = {}
    errors = []
    total = 0
    with tempfile.TemporaryDirectory(prefix="geii-proof-") as folder:
        tmp = Path(folder)
        for project in configuration:
            key = project["id"]
            manifest[key] = []
            for index, source in enumerate(project["files"], start=1):
                pdf = tmp / f"{key}-{index}.pdf"
                if not retrieve(source["id"], pdf):
                    errors.append({"project": key, "document": source["label"], "reason": "access unavailable"})
                    continue
                try:
                    with fitz.open(str(pdf)) as document:
                        print(f"{key} / {source['label']}: {len(document)} pages", flush=True)
                        for page_num, chapter, title in source["pages"]:
                            if not (1 <= page_num <= len(document)):
                                errors.append({"project": key, "document": source["label"], "reason": f"page {page_num} missing"})
                                continue
                            if not (0 <= chapter <= 5):
                                raise ValueError(f"Invalid chapter: {chapter}")
                            name = f"{index:02d}-page-{page_num:03d}.webp"
                            output = BASE / key / name
                            render_page(document[page_num - 1], output)
                            manifest[key].append({
                                "image": "/" + output.as_posix().removeprefix("public/"),
                                "title": title,
                                "desc": source["label"] + " — page " + str(page_num),
                                "source": "Étude technique GEII — " + source["label"],
                                "page": page_num,
                                "chapter": chapter
                            })
                            total += 1
                except Exception as exc:
                    errors.append({"project": key, "document": source["label"], "reason": str(exc)})
                pdf.unlink(missing_ok=True)
    # Le fichier manifeste est écrit uniquement avec les pages réellement exportées.
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    summary = {"projects": len(configuration), "figures": total,
               "per_project": {key: len(items) for key, items in manifest.items()},
               "errors": errors}
    Path("scripts/project_figure_report.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(summary, ensure_ascii=False, indent=2), flush=True)
    # Ne pas faire passer une récupération partielle pour une réussite complète.
    if errors:
        print("Des documents nécessitent une vérification manuelle ; les figures disponibles ont été conservées.")
    if total == 0:
        raise RuntimeError("Aucune capture générée.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
