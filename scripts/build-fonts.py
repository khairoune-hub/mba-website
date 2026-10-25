#!/usr/bin/env python3
"""
Rebuild the TheMixArab web fonts from assets/*.ttf → src/fonts/*.woff2.

The supplied TTFs are legacy fonts:
  * no GSUB table — Arabic joining relies on Unicode presentation forms (U+FB50–FEFF) in cmap,
    which some browsers (notably Safari) do not fall back to;
  * Bold has a corrupt `post` table that Chrome's font sanitizer (OTS) rejects outright,
    so every bold heading silently fell back to Tahoma/Arial.

This script drops legacy tables, regenerates glyph names, and builds a proper GSUB
(isol/init/medi/fina + rlig lam-alef) from the font's own presentation-form glyphs.

  python3 -m venv .venv && .venv/bin/pip install fonttools brotli
  .venv/bin/python scripts/build-fonts.py
"""
import io
import os
import sys
import unicodedata

from fontTools.feaLib.builder import addOpenTypeFeaturesFromString
from fontTools.ttLib import TTFont

WEIGHTS = {"Regular": 400, "Bold": 700, "Black": 900}
LEGACY_TABLES = ["LTSH", "VDMX", "hdmx", "kern"]
FORMS = {"<isolated>": "isol", "<initial>": "init", "<medial>": "medi", "<final>": "fina"}


def clean(path: str) -> TTFont:
    font = TTFont(path)
    for tag in LEGACY_TABLES:
        if tag in font:
            del font[tag]
    # Drop stored glyph names (Bold's are corrupt); reloading derives valid names from cmap.
    font["post"].formatType = 3.0
    buf = io.BytesIO()
    font.save(buf)
    buf.seek(0)
    return TTFont(buf)


def build_features(font: TTFont) -> tuple[str, list[str]]:
    cmap = font.getBestCmap()
    single: dict[str, list[tuple[str, str]]] = {k: [] for k in FORMS.values()}
    ligatures: list[tuple[str, int, int, str]] = []  # (form, lam, alef, glyph)
    for cp, glyph in sorted(cmap.items()):
        if not (0xFB50 <= cp <= 0xFEFF):
            continue
        parts = unicodedata.decomposition(chr(cp)).split()
        if not parts or parts[0] not in FORMS:
            continue
        form = FORMS[parts[0]]
        bases = [int(x, 16) for x in parts[1:]]
        if len(bases) == 1 and bases[0] in cmap:
            single[form].append((cmap[bases[0]], glyph))
        elif len(bases) == 2 and bases[0] == 0x0644:
            ligatures.append((form, bases[0], bases[1], glyph))

    missing = []
    fea = ["languagesystem DFLT dflt;", "languagesystem arab dflt;"]
    for feature, pairs in single.items():
        if not pairs:
            continue
        seen = {}
        for base, form_glyph in pairs:
            seen.setdefault(base, form_glyph)
        rules = "\n".join(f"    sub {b} by {g};" for b, g in seen.items())
        fea.append(f"feature {feature} {{\n{rules}\n}} {feature};")

    # Lam-alef: after init/medi/fina, lam is initial/medial and alef is final.
    lam_init = dict(single["init"]).get(cmap.get(0x0644))
    lam_medi = dict(single["medi"]).get(cmap.get(0x0644))
    fina = dict(single["fina"])
    rlig = []
    for form, lam, alef, lig in ligatures:
        alef_glyph = cmap.get(alef)
        alef_fina = fina.get(alef_glyph)
        if not alef_fina:
            continue
        if form == "isol" and lam_init:
            rlig.append(f"    sub {lam_init} {alef_fina} by {lig};")
        elif form == "fina" and lam_medi:
            rlig.append(f"    sub {lam_medi} {alef_fina} by {lig};")
    if rlig:
        fea.append("feature rlig {\n" + "\n".join(rlig) + "\n} rlig;")

    # Report Arabic letters that have no presentation forms at all.
    for cp in range(0x0621, 0x064B):
        if cp in cmap and not any(cmap[cp] == b for pairs in single.values() for b, _ in pairs):
            if unicodedata.category(chr(cp)).startswith("L"):
                missing.append(f"U+{cp:04X}")
    return "\n".join(fea), missing


def main() -> int:
    os.makedirs("src/fonts", exist_ok=True)
    for name, weight in WEIGHTS.items():
        font = clean(f"assets/TheMixArab-{name}.ttf")
        fea, missing = build_features(font)
        addOpenTypeFeaturesFromString(font, fea, tables=["GSUB"])  # keep existing GPOS (Black kerning)
        names = font["name"]
        names.setName("TheMixArab", 1, 3, 1, 0x409)
        names.setName(name, 2, 3, 1, 0x409)
        font["OS/2"].usWeightClass = weight
        font.flavor = "woff2"
        out = f"src/fonts/TheMixArab-{name}.woff2"
        font.save(out)
        lookups = len(font["GSUB"].table.LookupList.Lookup)
        print(f"{out}: {os.path.getsize(out)} bytes, GSUB lookups: {lookups}" + (f", no joining forms for: {' '.join(missing)}" if missing else ""))
    return 0


if __name__ == "__main__":
    sys.exit(main())
