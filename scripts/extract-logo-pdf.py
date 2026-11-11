"""Extracts the MBA logo (brand book v1.2, page 1) as clean SVGs into public/brand/.

The logo is vector in the PDF: "MBA" is drawn as paths and "BUSINESS ALLIANCE" is Fahkwang Bold text,
which PyMuPDF exports as glyph outlines. Nothing is traced, so the output matches the artwork exactly.

Run: python scripts/extract-logo-pdf.py   (needs PyMuPDF: pip install pymupdf)
Outputs: logo-{color,white,onGreen,mono}.svg and mark-{color,white}.svg (the "A" + triangle, used for icons).
"""
import re
import sys
from pathlib import Path

import pymupdf

PDF = Path('assets/MBA_brand_identity_1.2.pdf')
OUT = Path('public/brand')
INK_SRC, GREEN_SRC = ('#030505', '#030405'), '#1b8453'  # text and shapes use slightly different blacks
INK, GREEN = '#030405', '#1b8453'
PAD = 0  # trimmed tight; layout code adds clear space

svg = pymupdf.open(PDF)[0].get_svg_image(text_as_path=True)
glyphs = dict(re.findall(r'<path id="(font_[\d_]+)" d="([^"]+)"/>', svg))


def element_lines(lo: float, hi: float):
    """Logo elements: glyph <use>s and paths whose first coordinate falls in the logo's y band."""
    parts = []
    for m in re.finditer(r'<use data-text="[^"]*" xlink:href="#(font_[\d_]+)" transform="matrix\(([^)]+)\)" fill="(#[0-9a-f]{6})"/>', svg):
        gid, mat, fill = m.groups()
        a, b, c, d, e, f = map(float, mat.split(','))
        if lo <= f <= hi and gid in glyphs:  # spaces have no outline
            parts.append(('ink' if fill in INK_SRC else 'green', glyphs[gid], f'matrix({a:g} {b:g} {c:g} {d:g} {e:.3f} {f:.3f})', e))
    for m in re.finditer(r'<path d="(M[-\d.]+ ([-\d.]+)[^"]*)" fill="(#[0-9a-f]{6})"/>', svg):
        d, y, fill = m.group(1), float(m.group(2)), m.group(3)
        if lo <= y <= hi and (fill in INK_SRC or fill == GREEN_SRC):
            x = float(re.match(r'M([-\d.]+)', d).group(1))
            parts.append(('ink' if fill in INK_SRC else 'green', d, None, x))
    return parts


def bbox(body: str, vb: tuple[float, float, float, float]):
    """Tight bbox of rendered content, found by rasterising (PyMuPDF opens SVG)."""
    x, y, w, h = vb
    doc = pymupdf.open(stream=f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="{x} {y} {w} {h}">{body}</svg>'.encode(), filetype='svg')
    scale = 4
    pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=True)
    W, H, n, s = pix.width, pix.height, pix.n, pix.samples
    xs, ys = [], []
    for j in range(H):
        row = s[j * W * n:(j + 1) * W * n]
        for i in range(W):
            if row[i * n + n - 1] > 8:
                xs.append(i); ys.append(j)
    return (x + min(xs) / scale, y + min(ys) / scale, x + (max(xs) + 1) / scale, y + (max(ys) + 1) / scale)


def build(parts, ink: str, green: str, title: str, vb_hint):
    body = ''.join(
        f'<path fill="{ink if role == "ink" else green}"{f" transform={chr(34)}{tf}{chr(34)}" if tf else ""} d="{d}"/>'
        for role, d, tf, _ in parts
    )
    x0, y0, x1, y1 = bbox(body, vb_hint)
    x0, y0, x1, y1 = x0 - PAD, y0 - PAD, x1 + PAD, y1 + PAD
    w, h = x1 - x0, y1 - y0
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.2f} {y0:.2f} {w:.2f} {h:.2f}" width="{w:.0f}" height="{h:.0f}">'
        f'<title>{title}</title>{body}</svg>\n',
        (round(w), round(h)),
    )


OUT.mkdir(parents=True, exist_ok=True)
logo = element_lines(400, 740)  # excludes the page-corner triangles (y≥757) and the "2026" line
logo_vb = (380, 400, 1140, 360)
variants = {
    'color': (INK, GREEN),        # on white
    'white': ('#ffffff', GREEN),  # on black / dark
    'onGreen': ('#ffffff', '#ffffff'),
    'mono': (INK, INK),
}
for name, (ink, green) in variants.items():
    out, size = build(logo, ink, green, 'MZAB Business Alliance', logo_vb)
    (OUT / f'logo-{name}.svg').write_text(out, encoding='utf-8')
print('logo', size)

# Mark: the "A" (path starting x≈1122) + the triangle, without the wordmark text.
mark = [p for p in logo if p[2] is None and p[3] > 1100]
for name, (ink, green) in {'color': (INK, GREEN), 'white': ('#ffffff', GREEN)}.items():
    out, msize = build(mark, ink, green, 'MBA', (1090, 400, 420, 240))
    (OUT / f'mark-{name}.svg').write_text(out, encoding='utf-8')
print('mark', msize)
sys.exit(0)
