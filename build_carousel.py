"""Generate a 9:16 vertical carousel PDF for a clothing-resale social media video.

Output: carrusel_reventa_ropa.pdf with 7 slides (cover + 5 lessons + CTA)
plus a final page containing AI image-generation prompts in case the user
wants to replace the illustrations with real photos.
"""

from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import portrait
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit
import os
import random

# 9:16 page (1080 x 1920 logical units mapped to mm-ish PDF points)
W, H = 540, 960  # points; ratio 9:16

OUTPUT = os.path.join(os.path.dirname(__file__), "carrusel_reventa_ropa.pdf")

# Neutral palette
CREAM = HexColor("#F4EFE6")
CREAM_DARK = HexColor("#E8DFD0")
BEIGE = HexColor("#D9CBB3")
WARM_BEIGE = HexColor("#C9B89A")
GREY_LIGHT = HexColor("#D6D2CC")
GREY_MID = HexColor("#9C9690")
GREY_DARK = HexColor("#4A4641")
INK = HexColor("#2B2825")
WHITE = HexColor("#FAFAF7")
ACCENT = HexColor("#8B6F47")  # warm brown accent

# Try to register a nicer font; fallback to Helvetica
def register_fonts():
    candidates = [
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "BodyBold"),
        ("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", "Body"),
    ]
    available = {}
    for path, name in candidates:
        if os.path.exists(path):
            try:
                pdfmetrics.registerFont(TTFont(name, path))
                available[name] = name
            except Exception:
                pass
    return available

FONTS = register_fonts()
F_BOLD = "BodyBold" if "BodyBold" in FONTS else "Helvetica-Bold"
F_REG = "Body" if "Body" in FONTS else "Helvetica"

# ---------- Drawing helpers ----------

def grain(c, x, y, w, h, density=0.0006, seed=1):
    """Subtle paper-grain noise for natural-light feel."""
    rng = random.Random(seed)
    n = int(w * h * density)
    for _ in range(n):
        px = x + rng.random() * w
        py = y + rng.random() * h
        shade = 0.0 + rng.random() * 0.06
        c.setFillColorRGB(0, 0, 0, alpha=shade)
        c.circle(px, py, 0.4, stroke=0, fill=1)

def background(c, color=CREAM, seed=1):
    c.setFillColor(color)
    c.rect(0, 0, W, H, stroke=0, fill=1)
    grain(c, 0, 0, W, H, density=0.0004, seed=seed)

def soft_shadow(c, x, y, w, h, radius=8, alpha=0.08):
    c.setFillColor(Color(0, 0, 0, alpha=alpha))
    c.roundRect(x + 3, y - 6, w, h, radius, stroke=0, fill=1)

def draw_folded_garment(c, x, y, w, h, color, stripe=None, radius=4):
    """A folded clothing rectangle with a subtle fold line."""
    soft_shadow(c, x, y, w, h, radius=radius, alpha=0.07)
    c.setFillColor(color)
    c.roundRect(x, y, w, h, radius, stroke=0, fill=1)
    # fold line
    c.setStrokeColor(Color(0, 0, 0, alpha=0.06))
    c.setLineWidth(1)
    c.line(x + 6, y + h * 0.55, x + w - 6, y + h * 0.55)
    if stripe:
        c.setFillColor(stripe)
        c.rect(x + w * 0.2, y + h * 0.25, w * 0.6, 2, stroke=0, fill=1)

def draw_phone(c, cx, cy, w=110, h=200, screen_content=None):
    """A simple phone illustration with rounded corners."""
    x = cx - w / 2
    y = cy - h / 2
    soft_shadow(c, x, y, w, h, radius=14, alpha=0.12)
    c.setFillColor(GREY_DARK)
    c.roundRect(x, y, w, h, 14, stroke=0, fill=1)
    # screen
    pad = 6
    c.setFillColor(WHITE)
    c.roundRect(x + pad, y + pad + 4, w - 2 * pad, h - 2 * pad - 8, 8, stroke=0, fill=1)
    if screen_content:
        screen_content(c, x + pad, y + pad + 4, w - 2 * pad, h - 2 * pad - 8)
    # camera notch
    c.setFillColor(GREY_DARK)
    c.circle(cx, y + h - 10, 2.2, stroke=0, fill=1)

def draw_package(c, x, y, w, h, tone=BEIGE):
    """Kraft / mailer package."""
    soft_shadow(c, x, y, w, h, radius=4, alpha=0.1)
    c.setFillColor(tone)
    c.roundRect(x, y, w, h, 4, stroke=0, fill=1)
    # tape strip
    c.setFillColor(Color(1, 1, 1, alpha=0.5))
    c.rect(x, y + h * 0.45, w, h * 0.12, stroke=0, fill=1)
    # label
    c.setFillColor(WHITE)
    c.rect(x + w * 0.15, y + h * 0.6, w * 0.55, h * 0.22, stroke=0, fill=1)
    c.setStrokeColor(GREY_MID)
    c.setLineWidth(0.5)
    c.line(x + w * 0.2, y + h * 0.76, x + w * 0.55, y + h * 0.76)
    c.line(x + w * 0.2, y + h * 0.71, x + w * 0.5, y + h * 0.71)
    c.line(x + w * 0.2, y + h * 0.66, x + w * 0.6, y + h * 0.66)

def draw_tag(c, x, y, w=70, h=34, text="ENVÍO"):
    """Shipping tag with string."""
    c.setStrokeColor(GREY_MID)
    c.setLineWidth(0.8)
    c.line(x + w / 2, y + h, x + w / 2 + 10, y + h + 24)
    c.setFillColor(WHITE)
    c.roundRect(x, y, w, h, 3, stroke=0, fill=1)
    c.setStrokeColor(Color(0, 0, 0, alpha=0.15))
    c.setLineWidth(0.5)
    c.roundRect(x, y, w, h, 3, stroke=1, fill=0)
    c.circle(x + 6, y + h / 2, 2, stroke=1, fill=0)
    c.setFillColor(INK)
    c.setFont(F_BOLD, 7)
    c.drawCentredString(x + w / 2 + 4, y + h / 2 - 2.5, text)

def draw_bag_body(c, cx, cy, w=140, h=160, color=WARM_BEIGE):
    """Tote bag body (without handles), so callers can layer items above."""
    x = cx - w / 2
    y = cy - h / 2
    top = y + h
    soft_shadow(c, x, y, w, h, radius=6, alpha=0.1)
    c.setFillColor(color)
    c.roundRect(x, y, w, h, 6, stroke=0, fill=1)
    c.setStrokeColor(Color(0, 0, 0, alpha=0.08))
    c.setLineWidth(0.5)
    c.line(x + 8, top - 14, x + w - 8, top - 14)
    return (x, y, w, h, top)

def draw_bag_handles(c, x, w, top, rise=44):
    """Two bezier arches above the bag opening."""
    c.setStrokeColor(GREY_DARK)
    c.setLineWidth(3)
    for sx, ex in [(x + w * 0.18, x + w * 0.42), (x + w * 0.58, x + w * 0.82)]:
        p = c.beginPath()
        p.moveTo(sx, top)
        cx1 = sx + (ex - sx) * 0.20
        cx2 = sx + (ex - sx) * 0.80
        p.curveTo(cx1, top + rise, cx2, top + rise, ex, top)
        c.drawPath(p, stroke=1, fill=0)

def draw_bag(c, cx, cy, w=140, h=160, color=WARM_BEIGE):
    """Convenience: full bag (body + handles)."""
    x, y, w_, h_, top = draw_bag_body(c, cx, cy, w, h, color)
    draw_bag_handles(c, x, w_, top)

def wrap_draw(c, text, x, y, max_width, font, size, leading=None, color=INK, align="center"):
    """Wrap text to width and draw line by line. Returns final y after last line."""
    if leading is None:
        leading = size * 1.15
    c.setFont(font, size)
    c.setFillColor(color)
    lines = simpleSplit(text, font, size, max_width)
    cy = y
    for line in lines:
        if align == "center":
            c.drawCentredString(x, cy, line)
        elif align == "left":
            c.drawString(x - max_width / 2, cy, line)
        cy -= leading
    return cy

def draw_chip(c, cx, cy, label, padx=12, pady=6):
    c.setFont(F_BOLD, 9)
    tw = c.stringWidth(label, F_BOLD, 9)
    w = tw + 2 * padx
    h = 22
    c.setFillColor(INK)
    c.roundRect(cx - w / 2, cy - h / 2, w, h, h / 2, stroke=0, fill=1)
    c.setFillColor(CREAM)
    c.drawCentredString(cx, cy - 3, label)

def draw_counter(c, idx, total):
    """Small slide counter at bottom-right."""
    label = f"{idx}/{total}"
    c.setFont(F_REG, 9)
    c.setFillColor(GREY_MID)
    c.drawRightString(W - 20, 22, label)

def draw_arrow_right(c, x1, y1, x2, y2, color=INK, width=2):
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)
    # arrowhead
    import math
    angle = math.atan2(y2 - y1, x2 - x1)
    a = 10
    c.line(x2, y2, x2 - a * math.cos(angle - 0.5), y2 - a * math.sin(angle - 0.5))
    c.line(x2, y2, x2 - a * math.cos(angle + 0.5), y2 - a * math.sin(angle + 0.5))

# ---------- Slide builders ----------

def slide_cover(c, idx, total):
    background(c, CREAM, seed=10)

    # Composition area (top 60%)
    # bed/table surface
    c.setFillColor(WHITE)
    c.roundRect(40, 380, W - 80, 420, 18, stroke=0, fill=1)
    grain(c, 40, 380, W - 80, 420, density=0.0006, seed=22)

    # Stacks of folded clothes (varied tones, ordered)
    palette = [WHITE, GREY_LIGHT, BEIGE, CREAM_DARK, WARM_BEIGE]
    rows = [
        (70, 720, [(80, 50, WHITE, None), (80, 50, GREY_LIGHT, ACCENT), (80, 50, BEIGE, None), (80, 50, CREAM_DARK, None)]),
        (70, 660, [(80, 50, GREY_LIGHT, None), (80, 50, WHITE, None), (80, 50, WARM_BEIGE, None), (80, 50, GREY_MID, None)]),
        (70, 600, [(80, 50, BEIGE, None), (80, 50, WHITE, ACCENT), (80, 50, GREY_LIGHT, None), (80, 50, CREAM_DARK, None)]),
    ]
    for (x0, y0, garments) in rows:
        x = x0
        for w, h, col, stripe in garments:
            draw_folded_garment(c, x, y0, w, h, col, stripe=stripe)
            x += w + 12

    # Shipping tags scattered
    draw_tag(c, 80, 470, text="VINTED")
    draw_tag(c, 380, 460, text="ENVÍO")

    # Phone with blurred app
    def app_screen(c, x, y, w, h):
        # blurred-ish vinted-style grid
        c.setFillColor(HexColor("#0DBC79"))
        c.rect(x, y + h - 22, w, 22, stroke=0, fill=1)
        c.setFillColor(WHITE)
        c.setFont(F_BOLD, 8)
        c.drawCentredString(x + w / 2, y + h - 14, "RESALE APP")
        # product grid
        c.setFillColor(GREY_LIGHT)
        cols = 2
        rows_ = 3
        pad = 4
        cw = (w - pad * (cols + 1)) / cols
        ch = (h - 22 - pad * (rows_ + 1)) / rows_
        for r in range(rows_):
            for col in range(cols):
                px = x + pad + col * (cw + pad)
                py = y + pad + r * (ch + pad)
                shade = HexColor("#E8DFD0") if (r + col) % 2 == 0 else HexColor("#D6D2CC")
                c.setFillColor(shade)
                c.roundRect(px, py, cw, ch, 3, stroke=0, fill=1)
        # soft blur overlay
        c.setFillColor(Color(1, 1, 1, alpha=0.35))
        c.rect(x, y, w, h - 22, stroke=0, fill=1)

    draw_phone(c, W - 110, 540, w=120, h=210, screen_content=app_screen)

    # Title block (bottom 40%)
    c.setFillColor(CREAM)
    c.rect(0, 0, W, 360, stroke=0, fill=1)

    # Eyebrow chip
    draw_chip(c, W / 2, 320, "LECCIONES REALES · 1 SEMANA")

    # Main title
    wrap_draw(
        c,
        "Lo que aprendí en 1 semana revendiendo ropa",
        W / 2, 250, W - 80, F_BOLD, 38, leading=44, color=INK
    )

    # Subtext
    wrap_draw(
        c,
        "Lecciones reales desde cero",
        W / 2, 110, W - 100, F_REG, 18, leading=22, color=GREY_DARK
    )

    # small swipe hint
    c.setFont(F_REG, 10)
    c.setFillColor(GREY_MID)
    c.drawCentredString(W / 2, 60, "DESLIZA  →")

    draw_counter(c, idx, total)

def slide_lesson_1(c, idx, total):
    background(c, CREAM, seed=11)
    # bed surface
    c.setFillColor(WHITE)
    c.roundRect(30, 360, W - 60, 480, 16, stroke=0, fill=1)
    grain(c, 30, 360, W - 60, 480, density=0.0005, seed=33)

    # background "raras" prendas (blurred feel via low contrast)
    c.saveState()
    c.setFillColor(Color(0.85, 0.62, 0.55, alpha=0.55))  # loud color, faded
    c.roundRect(70, 720, 160, 90, 8, stroke=0, fill=1)
    c.setFillColor(Color(0.4, 0.55, 0.7, alpha=0.4))
    c.roundRect(310, 730, 150, 80, 8, stroke=0, fill=1)
    # blur sim: layer translucent cream on top
    c.setFillColor(Color(0.96, 0.94, 0.90, alpha=0.55))
    c.rect(30, 710, W - 60, 130, stroke=0, fill=1)
    c.restoreState()

    # Featured basic garment center
    cx = W / 2
    # main folded basic in grey
    bw, bh = 240, 150
    draw_folded_garment(c, cx - bw / 2, 470, bw, bh, GREY_LIGHT)
    # second smaller fold on top, white
    draw_folded_garment(c, cx - 90, 600, 180, 50, WHITE)

    # spotlight ring
    c.setStrokeColor(INK)
    c.setLineWidth(1.2)
    c.setDash(3, 3)
    c.circle(cx, 560, 160, stroke=1, fill=0)
    c.setDash()

    # Tag pointing to it
    c.setFont(F_BOLD, 9)
    c.setFillColor(INK)
    c.drawString(cx + 140, 690, "BÁSICO")
    draw_arrow_right(c, cx + 138, 685, cx + 70, 640)

    # faded label for "raro"
    c.setFont(F_BOLD, 9)
    c.setFillColor(GREY_MID)
    c.drawString(80, 800, "RARO")

    # Header chip
    draw_chip(c, W / 2, 320, "LECCIÓN 1")

    # Main text
    wrap_draw(
        c,
        "La ropa básica se vende mejor que la rara",
        W / 2, 250, W - 60, F_BOLD, 34, leading=40, color=INK
    )
    wrap_draw(
        c,
        "La gente compra lo que puede usar fácilmente.",
        W / 2, 110, W - 90, F_REG, 16, leading=20, color=GREY_DARK
    )
    draw_counter(c, idx, total)

def slide_lesson_2(c, idx, total):
    background(c, CREAM, seed=12)

    # Split screen comparison
    split_y = 430
    split_h = 380
    half_w = (W - 80) / 2

    # LEFT: dark, bad photo
    lx = 30
    c.setFillColor(HexColor("#3A352F"))
    c.roundRect(lx, split_y + 20, half_w - 6, split_h - 40, 10, stroke=0, fill=1)
    # blurry garment
    c.setFillColor(Color(0.55, 0.5, 0.45, alpha=1))
    c.roundRect(lx + 30, split_y + 130, half_w - 66, 160, 8, stroke=0, fill=1)
    # noise
    grain(c, lx, split_y + 20, half_w - 6, split_h - 40, density=0.003, seed=44)
    # X badge
    c.setFillColor(HexColor("#B5453B"))
    c.circle(lx + 30, split_y + split_h - 30, 14, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(F_BOLD, 16)
    c.drawCentredString(lx + 30, split_y + split_h - 35, "✕")

    # RIGHT: bright, clean photo
    rx = W / 2 + 10
    c.setFillColor(WHITE)
    c.roundRect(rx, split_y + 20, half_w - 6, split_h - 40, 10, stroke=0, fill=1)
    # crisp garment
    draw_folded_garment(c, rx + 30, split_y + 130, half_w - 66, 130, GREY_LIGHT, stripe=None)
    # check badge
    c.setFillColor(HexColor("#3F7D4F"))
    c.circle(rx + half_w - 36, split_y + split_h - 30, 14, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.setFont(F_BOLD, 16)
    c.drawCentredString(rx + half_w - 36, split_y + split_h - 35, "✓")

    # arrow between
    draw_arrow_right(c, W / 2 - 20, split_y + split_h / 2, W / 2 + 20, split_y + split_h / 2, color=INK, width=3)

    # labels above each
    c.setFont(F_BOLD, 11)
    c.setFillColor(GREY_DARK)
    c.drawCentredString(lx + half_w / 2, split_y + split_h + 4, "ANTES")
    c.drawCentredString(rx + half_w / 2, split_y + split_h + 4, "DESPUÉS")

    # Header chip
    draw_chip(c, W / 2, 320, "LECCIÓN 2")
    wrap_draw(
        c,
        "Las fotos lo son TODO",
        W / 2, 250, W - 60, F_BOLD, 40, leading=46, color=INK
    )
    wrap_draw(
        c,
        "Una buena foto puede cambiarlo todo.",
        W / 2, 110, W - 90, F_REG, 16, leading=20, color=GREY_DARK
    )
    draw_counter(c, idx, total)

def slide_lesson_3(c, idx, total):
    background(c, CREAM, seed=13)
    # table
    c.setFillColor(WHITE)
    c.roundRect(30, 360, W - 60, 480, 16, stroke=0, fill=1)
    grain(c, 30, 360, W - 60, 480, density=0.0005, seed=55)

    # rows of packages aligned (sense of volume)
    pkg_w, pkg_h = 90, 110
    rows = [(420, [60, 165, 270, 375]), (560, [60, 165, 270, 375]), (700, [60, 165, 270, 375])]
    tones = [BEIGE, CREAM_DARK, WARM_BEIGE, BEIGE]
    for (y, xs) in rows:
        for i, x in enumerate(xs):
            draw_package(c, x, y, pkg_w, pkg_h, tone=tones[i % len(tones)])

    # motion lines (sense of movement)
    c.setStrokeColor(GREY_MID)
    c.setLineWidth(1.4)
    for i, y in enumerate([400, 540, 680]):
        c.line(W - 50, y + 50, W - 20, y + 50)
        c.line(W - 55, y + 60, W - 25, y + 60)

    # tag
    draw_tag(c, 380, 380, text="ENVIADO")

    # Header
    draw_chip(c, W / 2, 320, "LECCIÓN 3")
    wrap_draw(
        c,
        "Mejor vender rápido que vender caro",
        W / 2, 250, W - 60, F_BOLD, 34, leading=40, color=INK
    )
    wrap_draw(
        c,
        "La rotación genera más dinero a largo plazo.",
        W / 2, 110, W - 90, F_REG, 16, leading=20, color=GREY_DARK
    )
    draw_counter(c, idx, total)

def slide_lesson_4(c, idx, total):
    background(c, CREAM, seed=14)
    # clean surface
    c.setFillColor(WHITE)
    c.roundRect(60, 380, W - 120, 460, 18, stroke=0, fill=1)
    grain(c, 60, 380, W - 120, 460, density=0.0005, seed=66)

    # canvas bag: draw body first, then garments peeking out, then handles on top
    bag_cx, bag_cy, bag_w, bag_h = W / 2, 590, 220, 230
    x, y, bw, bh, top = draw_bag_body(c, bag_cx, bag_cy, bag_w, bag_h, WARM_BEIGE)
    # garments peeking out the bag's opening (slightly above the top edge)
    draw_folded_garment(c, bag_cx - 85, top - 18, 70, 34, WHITE)
    draw_folded_garment(c, bag_cx - 10, top - 14, 70, 34, GREY_LIGHT)
    draw_folded_garment(c, bag_cx + 50, top - 22, 55, 30, BEIGE)
    # handles arch above
    draw_bag_handles(c, x, bw, top, rise=48)

    # tiny price tag on bag
    draw_tag(c, W / 2 - 30, 470, text="THRIFT")

    # Header
    draw_chip(c, W / 2, 320, "LECCIÓN 4")
    wrap_draw(
        c,
        "No hace falta mucho dinero para empezar",
        W / 2, 250, W - 60, F_BOLD, 32, leading=38, color=INK
    )
    wrap_draw(
        c,
        "Se puede empezar con muy poco stock.",
        W / 2, 110, W - 90, F_REG, 16, leading=20, color=GREY_DARK
    )
    draw_counter(c, idx, total)

def slide_lesson_5(c, idx, total):
    background(c, HexColor("#F1E9DA"), seed=15)  # slightly warmer for "natural warm light"
    # surface
    c.setFillColor(WHITE)
    c.roundRect(40, 380, W - 80, 460, 18, stroke=0, fill=1)
    grain(c, 40, 380, W - 80, 460, density=0.0005, seed=77)

    # Folded garment being photographed
    draw_folded_garment(c, W / 2 - 110, 500, 220, 130, GREY_LIGHT)

    # Phone tilted, showing upload-in-progress
    def upload_screen(c, x, y, w, h):
        c.setFillColor(WHITE)
        c.rect(x, y, w, h, stroke=0, fill=1)
        # photo preview
        c.setFillColor(GREY_LIGHT)
        c.roundRect(x + 8, y + h - 90, w - 16, 80, 5, stroke=0, fill=1)
        # progress bar
        c.setFillColor(HexColor("#E8DFD0"))
        c.roundRect(x + 10, y + h - 110, w - 20, 8, 4, stroke=0, fill=1)
        c.setFillColor(HexColor("#0DBC79"))
        c.roundRect(x + 10, y + h - 110, (w - 20) * 0.68, 8, 4, stroke=0, fill=1)
        # text lines
        c.setFillColor(GREY_MID)
        c.rect(x + 10, y + h - 130, w - 40, 4, stroke=0, fill=1)
        c.rect(x + 10, y + h - 142, w - 70, 4, stroke=0, fill=1)
        c.setFillColor(INK)
        c.setFont(F_BOLD, 7)
        c.drawString(x + 10, y + 12, "SUBIENDO...")

    # rotate phone slightly
    c.saveState()
    c.translate(W / 2 + 60, 720)
    c.rotate(-12)
    draw_phone(c, 0, 0, w=140, h=240, screen_content=upload_screen)
    c.restoreState()

    # warm light glow
    c.setFillColor(Color(1, 0.85, 0.55, alpha=0.18))
    c.circle(W - 40, 820, 180, stroke=0, fill=1)

    # Header
    draw_chip(c, W / 2, 320, "LECCIÓN 5")
    wrap_draw(
        c,
        "Lo importante es empezar",
        W / 2, 250, W - 60, F_BOLD, 40, leading=46, color=INK
    )
    wrap_draw(
        c,
        "Aprendes más haciendo que pensando.",
        W / 2, 110, W - 90, F_REG, 16, leading=20, color=GREY_DARK
    )
    draw_counter(c, idx, total)

def slide_cta(c, idx, total):
    background(c, CREAM, seed=16)
    # mini-business workspace
    c.setFillColor(WHITE)
    c.roundRect(30, 380, W - 60, 480, 18, stroke=0, fill=1)
    grain(c, 30, 380, W - 60, 480, density=0.0005, seed=88)

    # rows of folded clothes (left)
    for i, (col, st) in enumerate([(WHITE, None), (GREY_LIGHT, None), (BEIGE, ACCENT), (CREAM_DARK, None)]):
        draw_folded_garment(c, 60, 430 + i * 70, 130, 56, col, stripe=st)

    # packages (right top)
    for i, x in enumerate([240, 340, 440]):
        draw_package(c, x, 720, 80, 100, tone=[BEIGE, CREAM_DARK, WARM_BEIGE][i])

    # tags
    draw_tag(c, 250, 640, text="ENVÍO")
    draw_tag(c, 360, 620, text="VINTED")

    # phone bottom right
    def home_screen(c, x, y, w, h):
        c.setFillColor(HexColor("#0DBC79"))
        c.rect(x, y + h - 18, w, 18, stroke=0, fill=1)
        c.setFillColor(GREY_LIGHT)
        c.roundRect(x + 6, y + h - 70, w - 12, 46, 4, stroke=0, fill=1)
        c.setFillColor(BEIGE)
        c.roundRect(x + 6, y + h - 122, w - 12, 46, 4, stroke=0, fill=1)
        c.setFillColor(CREAM_DARK)
        c.roundRect(x + 6, y + h - 174, w - 12, 46, 4, stroke=0, fill=1)

    draw_phone(c, W - 110, 470, w=110, h=180, screen_content=home_screen)

    # Header chip + small "eyes" icon evoking 👀
    draw_chip(c, W / 2, 320, "PRÓXIMOS PASOS")
    # tiny eyes glyph above the title
    c.setFillColor(INK)
    c.circle(W / 2 - 14, 285, 5, stroke=0, fill=1)
    c.circle(W / 2 + 14, 285, 5, stroke=0, fill=1)
    c.setFillColor(WHITE)
    c.circle(W / 2 - 12, 287, 1.6, stroke=0, fill=1)
    c.circle(W / 2 + 16, 287, 1.6, stroke=0, fill=1)
    wrap_draw(
        c,
        "Voy a seguir compartiendo lo que aprendo",
        W / 2, 250, W - 60, F_BOLD, 30, leading=36, color=INK
    )
    wrap_draw(
        c,
        "Sígueme si quieres ver el proceso completo.",
        W / 2, 130, W - 90, F_REG, 17, leading=22, color=GREY_DARK
    )

    # CTA button
    btn_w, btn_h = 240, 50
    bx = W / 2 - btn_w / 2
    by = 50
    c.setFillColor(INK)
    c.roundRect(bx, by, btn_w, btn_h, btn_h / 2, stroke=0, fill=1)
    c.setFillColor(CREAM)
    c.setFont(F_BOLD, 14)
    c.drawCentredString(W / 2, by + btn_h / 2 - 5, "SÍGUEME  →")

    draw_counter(c, idx, total)

# ---------- Appendix: AI prompts page ----------

def slide_prompts(c, idx, total):
    # Larger reference page (still 9:16 size for consistency)
    background(c, WHITE, seed=99)
    c.setFillColor(INK)
    c.setFont(F_BOLD, 22)
    c.drawString(40, H - 60, "Prompts IA (opcional)")
    c.setFont(F_REG, 11)
    c.setFillColor(GREY_DARK)
    c.drawString(40, H - 82, "Para sustituir las ilustraciones por fotos reales en Midjourney / DALL·E / Sora.")

    prompts = [
        ("Portada",
         "Top-down flat lay on a clean bed: neatly folded basic clothes (white tee, "
         "grey hoodie, beige sweater) in soft natural light, kraft shipping label, "
         "blurred phone showing a resale app (Vinted-style green). Beige/white/grey "
         "palette, minimalist, documentary feel, 9:16."),
        ("Lección 1",
         "A perfectly folded grey hoodie and a white tee centered on a clean white "
         "bed, soft natural window light. In the background, slightly out of focus, "
         "a loud-patterned shirt. Minimalist, neutral tones, 9:16."),
        ("Lección 2",
         "Split-screen vertical comparison of the same folded white t-shirt: left "
         "side dark, blurry, poorly lit phone photo; right side bright, sharp, white "
         "background, natural window light. 9:16."),
        ("Lección 3",
         "Top-down shot of a wooden table with multiple kraft mailer packages aligned "
         "neatly, printed shipping labels visible, a few canvas bags. Natural light, "
         "beige and white palette, sense of volume, 9:16."),
        ("Lección 4",
         "A canvas thrift tote bag on a clean minimalist surface, just a few folded "
         "garments peeking out, soft daylight, neutral tones, 9:16."),
        ("Lección 5",
         "A hand holding a phone, screen showing a clothing listing being uploaded "
         "with a progress bar. Warm natural light, folded garment on white surface "
         "below. Sense of action and motion, 9:16."),
        ("CTA",
         "Aspirational home-business workspace flat lay: folded clothes in neat "
         "stacks, kraft packages, printed shipping tags, phone with resale app, all "
         "perfectly organized on a clean light wood desk. Natural light, "
         "beige/white/grey palette, 9:16."),
    ]
    y = H - 120
    for title, body in prompts:
        c.setFont(F_BOLD, 12)
        c.setFillColor(INK)
        c.drawString(40, y, title)
        y -= 16
        c.setFont(F_REG, 9.5)
        c.setFillColor(GREY_DARK)
        lines = simpleSplit(body, F_REG, 9.5, W - 80)
        for line in lines:
            c.drawString(40, y, line)
            y -= 12
        y -= 8

    c.setFont(F_REG, 8)
    c.setFillColor(GREY_MID)
    c.drawString(40, 30, "Estilo común: realistic photography, soft natural light, beige/white/grey palette, minimalist, no faces, 9:16.")

# ---------- Build PDF ----------

def build():
    c = canvas.Canvas(OUTPUT, pagesize=(W, H))
    c.setTitle("Lo que aprendí en 1 semana revendiendo ropa")
    c.setAuthor("Carrusel reventa")

    slides = [slide_cover, slide_lesson_1, slide_lesson_2, slide_lesson_3,
              slide_lesson_4, slide_lesson_5, slide_cta]
    total = len(slides)
    for i, fn in enumerate(slides, start=1):
        fn(c, i, total)
        c.showPage()

    # Appendix
    slide_prompts(c, total + 1, total + 1)
    c.showPage()

    c.save()
    print(f"Wrote {OUTPUT}")

if __name__ == "__main__":
    build()
