"""Generate the 9:16 vertical carousel using the user's real photos.

- Each slide places the photo in the top ~70% (cropped to 9:11 frame).
- Texts (chip, main title, subtitle) sit on a clean cream band below.
- Output: carrusel_reventa_ropa_fotos.pdf + slides_fotos/*.png
"""

import os
from io import BytesIO
from PIL import Image
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit, ImageReader

ROOT = os.path.dirname(os.path.abspath(__file__))
FOTOS = os.path.join(ROOT, "fotos")
OUT_PDF = os.path.join(ROOT, "carrusel_reventa_ropa_fotos.pdf")
OUT_PNG_DIR = os.path.join(ROOT, "slides_fotos")
os.makedirs(OUT_PNG_DIR, exist_ok=True)

# 9:16 page
W, H = 540, 960

# Palette
CREAM = HexColor("#F4EFE6")
WHITE = HexColor("#FAFAF7")
INK = HexColor("#2B2825")
GREY_DARK = HexColor("#4A4641")
GREY_MID = HexColor("#9C9690")

# Fonts
def register_fonts():
    pairs = [
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "BodyBold"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "Body"),
    ]
    for path, name in pairs:
        if os.path.exists(path):
            try:
                pdfmetrics.registerFont(TTFont(name, path))
            except Exception:
                pass

register_fonts()
F_BOLD = "BodyBold" if "BodyBold" in pdfmetrics.getRegisteredFontNames() else "Helvetica-Bold"
F_REG = "Body" if "Body" in pdfmetrics.getRegisteredFontNames() else "Helvetica"

# Layout: photo occupies top 700 pt; bottom 260 pt is the text band
PHOTO_H = 700
PHOTO_TOP = H               # photo extends up to top edge
PHOTO_BOTTOM = H - PHOTO_H  # = 260
TEXT_TOP = PHOTO_BOTTOM     # = 260

PHOTO_ASPECT = W / PHOTO_H  # ~0.77 -> we crop the source image to this aspect


def crop_to_aspect(im: Image.Image, target_aspect: float) -> Image.Image:
    """Center-crop a PIL image to a given aspect ratio (width / height)."""
    w, h = im.size
    cur = w / h
    if cur > target_aspect:
        # too wide, crop sides
        new_w = int(h * target_aspect)
        x0 = (w - new_w) // 2
        return im.crop((x0, 0, x0 + new_w, h))
    else:
        # too tall, crop top/bottom (bias slightly above center to keep subjects)
        new_h = int(w / target_aspect)
        y0 = max(0, (h - new_h) // 2)
        return im.crop((0, y0, w, y0 + new_h))


def load_photo(path: str, aspect: float = PHOTO_ASPECT) -> ImageReader:
    """Open a photo, crop to aspect ratio, return ImageReader for ReportLab."""
    im = Image.open(path)
    if im.mode != "RGB":
        im = im.convert("RGB")
    im = crop_to_aspect(im, aspect)
    buf = BytesIO()
    im.save(buf, format="JPEG", quality=88)
    buf.seek(0)
    return ImageReader(buf)


def draw_photo(c, photo_path, top_inset=0):
    """Fill the photo area (W x PHOTO_H) starting at y=PHOTO_BOTTOM."""
    img = load_photo(photo_path)
    c.drawImage(
        img,
        0, PHOTO_BOTTOM,
        width=W, height=PHOTO_H,
        preserveAspectRatio=False,
        mask=None,
    )
    # subtle soft separator at the photo's lower edge
    c.setFillColor(Color(0, 0, 0, alpha=0.0))
    c.rect(0, PHOTO_BOTTOM - 1, W, 2, stroke=0, fill=1)


def draw_text_band(c):
    """Solid cream band beneath the photo where text lives."""
    c.setFillColor(CREAM)
    c.rect(0, 0, W, TEXT_TOP, stroke=0, fill=1)


def draw_chip(c, cx, cy, label, padx=12):
    c.setFont(F_BOLD, 9)
    tw = c.stringWidth(label, F_BOLD, 9)
    w = tw + 2 * padx
    h = 22
    c.setFillColor(INK)
    c.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2, stroke=0, fill=1)
    c.setFillColor(CREAM)
    c.drawCentredString(cx, cy - 3, label)


def wrap_draw(c, text, x, y, max_width, font, size, leading=None, color=INK):
    if leading is None:
        leading = size * 1.15
    c.setFont(font, size)
    c.setFillColor(color)
    lines = simpleSplit(text, font, size, max_width)
    cy = y
    for line in lines:
        c.drawCentredString(x, cy, line)
        cy -= leading
    return cy


def draw_counter(c, idx, total):
    c.setFont(F_REG, 9)
    c.setFillColor(GREY_MID)
    c.drawRightString(W - 18, 18, f"{idx}/{total}")


def slide(c, photo, chip, title, subtitle, idx, total,
          title_size=28, title_leading=33, chip_y=224, title_y=178, subtitle_y=70):
    draw_photo(c, photo)
    draw_text_band(c)
    draw_chip(c, W / 2, chip_y, chip)
    wrap_draw(c, title, W / 2, title_y, W - 60, F_BOLD, title_size, title_leading)
    wrap_draw(c, subtitle, W / 2, subtitle_y, W - 80, F_REG, 14, 18, color=GREY_DARK)
    draw_counter(c, idx, total)


# Slide content config
SLIDES = [
    {
        "photo": "01_portada.png",
        "chip": "LECCIONES REALES · 1 SEMANA",
        "title": "Lo que aprendí en 1 semana revendiendo ropa",
        "subtitle": "Lecciones reales desde cero",
        "title_size": 24, "title_leading": 28,
    },
    {
        "photo": "02_leccion1.png",
        "chip": "LECCIÓN 1",
        "title": "La ropa básica se vende mejor que la rara",
        "subtitle": "La gente compra lo que puede usar fácilmente.",
        "title_size": 24, "title_leading": 28,
    },
    {
        "photo": "03_leccion2_antes_y_despues.png",
        "chip": "LECCIÓN 2",
        "title": "Las fotos lo son TODO",
        "subtitle": "Una buena foto puede cambiarlo todo.",
        "title_size": 32, "title_leading": 36,
    },
    {
        "photo": "04_leccion3.png",
        "chip": "LECCIÓN 3",
        "title": "Mejor vender rápido que vender caro",
        "subtitle": "La rotación genera más dinero a largo plazo.",
        "title_size": 25, "title_leading": 29,
    },
    {
        "photo": "05_leccion4.png",
        "chip": "LECCIÓN 4",
        "title": "No hace falta mucho dinero para empezar",
        "subtitle": "Se puede empezar con muy poco stock.",
        "title_size": 24, "title_leading": 28,
    },
    {
        "photo": "06_leccion5.png",
        "chip": "LECCIÓN 5",
        "title": "Lo importante es empezar",
        "subtitle": "Aprendes más haciendo que pensando.",
        "title_size": 32, "title_leading": 36,
    },
    {
        "photo": "07_cta.png",
        "chip": "PRÓXIMOS PASOS",
        "title": "Voy a seguir compartiendo lo que aprendo",
        "subtitle": "Sígueme si quieres ver el proceso completo.",
        "title_size": 23, "title_leading": 27,
        "is_cta": True,
    },
]


def slide_cta(c, cfg, idx, total):
    # Like a regular slide but with eyes glyph above title and a SÍGUEME button
    draw_photo(c, os.path.join(FOTOS, cfg["photo"]))
    draw_text_band(c)
    draw_chip(c, W / 2, 232, cfg["chip"])
    # tiny eyes glyph above the title
    c.setFillColor(INK)
    c.circle(W / 2 - 12, 208, 4, stroke=0, fill=1)
    c.circle(W / 2 + 12, 208, 4, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.circle(W / 2 - 10, 209.5, 1.3, stroke=0, fill=1)
    c.circle(W / 2 + 14, 209.5, 1.3, stroke=0, fill=1)
    # Title (slightly smaller to fit with the button)
    wrap_draw(c, cfg["title"], W / 2, 178, W - 60, F_BOLD, cfg["title_size"], cfg["title_leading"])
    wrap_draw(c, cfg["subtitle"], W / 2, 88, W - 80, F_REG, 13, 17, color=GREY_DARK)
    # button
    btn_w, btn_h = 200, 38
    bx = W / 2 - btn_w / 2
    by = 28
    c.setFillColor(INK)
    c.roundRect(bx, by, btn_w, btn_h, btn_h / 2, stroke=0, fill=1)
    c.setFillColor(CREAM)
    c.setFont(F_BOLD, 12)
    c.drawCentredString(W / 2, by + btn_h / 2 - 4, "SÍGUEME  →")
    draw_counter(c, idx, total)


def build():
    c = canvas.Canvas(OUT_PDF, pagesize=(W, H))
    c.setTitle("Lo que aprendí en 1 semana revendiendo ropa — Fotos")

    total = len(SLIDES)
    for i, cfg in enumerate(SLIDES, start=1):
        photo_path = os.path.join(FOTOS, cfg["photo"])
        if not os.path.exists(photo_path):
            raise FileNotFoundError(photo_path)
        if cfg.get("is_cta"):
            slide_cta(c, cfg, i, total)
        else:
            slide(c, photo_path, cfg["chip"], cfg["title"], cfg["subtitle"],
                  i, total,
                  title_size=cfg.get("title_size", 28),
                  title_leading=cfg.get("title_leading", 33))
        c.showPage()

    c.save()
    print(f"PDF -> {OUT_PDF}")


def render_pngs():
    import fitz
    names = ["01_portada", "02_leccion1", "03_leccion2", "04_leccion3",
             "05_leccion4", "06_leccion5", "07_cta"]
    doc = fitz.open(OUT_PDF)
    for i, page in enumerate(doc):
        pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0))
        out = os.path.join(OUT_PNG_DIR, f"{names[i]}.png")
        pix.save(out)
        print(f"PNG -> {out}  {pix.width}x{pix.height}")


if __name__ == "__main__":
    build()
    render_pngs()
