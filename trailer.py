#!/usr/bin/env python3
"""
trailer.py — Generate a 40s vertical trailer (1080x1920 @ 30fps) for a
reselling channel (YouTube Shorts / TikTok / Reels).

Run from a folder containing:
    musica.mp3
    veuenoff.mp3   (optional)
    escena1.jpg ... escena5.jpg

Missing images fall back to a black background; missing audio is skipped.
"""

import importlib
import os
import subprocess
import sys
import traceback


# --------------------------------------------------------------------------
# Auto-install dependencies
# --------------------------------------------------------------------------
REQUIRED = [
    ("moviepy", "moviepy==1.0.3"),
    ("PIL", "Pillow"),
    ("numpy", "numpy"),
]


def ensure_deps():
    for mod, pkg in REQUIRED:
        try:
            importlib.import_module(mod)
        except ImportError:
            print(f"[setup] Installing {pkg} ...")
            subprocess.check_call(
                [sys.executable, "-m", "pip", "install", "--quiet", pkg]
            )


ensure_deps()

import numpy as np
from PIL import Image, ImageDraw, ImageFont
from moviepy.editor import (
    AudioFileClip,
    CompositeAudioClip,
    CompositeVideoClip,
    ImageClip,
    VideoClip,
    concatenate_videoclips,
)


# --------------------------------------------------------------------------
# Config
# --------------------------------------------------------------------------
WIDTH, HEIGHT = 1080, 1920
FPS = 30
CROSSFADE = 0.5
OUTPUT_NAME = "trailer.mp4"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

SCENES = [
    {
        "img": "escena1.jpg",
        "text": "¿Comprar barato y vender caro? Sí, existe.",
        "duration": 4,
        "font_size": 70,
    },
    {
        "img": "escena2.jpg",
        "text": "Hay productos que desaparecen en segundos.",
        "duration": 8,
        "font_size": 70,
    },
    {
        "img": "escena3.jpg",
        "text": "Sneakers · Tech · Streetwear · Coleccionables",
        "duration": 12,
        "font_size": 70,
    },
    {
        "img": "escena4.jpg",
        "text": "Comprado a X€ → Vendido a X€. Sin humo.",
        "duration": 9,
        "font_size": 70,
    },
    {
        "img": "escena5.jpg",
        "text": "SÍGUEME. Empieza a revender.",
        "duration": 7,
        "font_size": 95,
    },
]

FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/TTF/DejaVuSans-Bold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "arialbd.ttf",
    "Arial Bold.ttf",
]


def find_font(size):
    for path in FONT_CANDIDATES:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            continue
    print("[warn] No TrueType font found; falling back to PIL default.")
    return ImageFont.load_default()


# --------------------------------------------------------------------------
# Image / Ken Burns
# --------------------------------------------------------------------------
def load_image_filled(path):
    """Return a 1080x1920 RGB PIL.Image (cover-fit, center-cropped)."""
    if not os.path.exists(path):
        print(f"[warn] Missing image {os.path.basename(path)} — using black.")
        return Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
    try:
        img = Image.open(path).convert("RGB")
    except Exception as e:
        print(f"[warn] Cannot open {path}: {e} — using black.")
        return Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))

    scale = max(WIDTH / img.width, HEIGHT / img.height)
    new_w, new_h = int(round(img.width * scale)), int(round(img.height * scale))
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - WIDTH) // 2
    top = (new_h - HEIGHT) // 2
    return img.crop((left, top, left + WIDTH, top + HEIGHT))


def ken_burns_clip(pil_img, duration):
    """Smooth zoom 1.00 → 1.15 with a gentle diagonal pan."""
    base = np.array(pil_img)
    H, W = base.shape[:2]

    def make_frame(t):
        p = (t / duration) if duration > 0 else 0.0
        p = max(0.0, min(1.0, p))
        zoom = 1.0 + 0.15 * p
        pan_x = (p - 0.5) * 0.06 * W
        pan_y = (p - 0.5) * 0.06 * H

        crop_w = W / zoom
        crop_h = H / zoom
        cx = W / 2 + pan_x
        cy = H / 2 + pan_y
        x0 = int(max(0, min(W - crop_w, cx - crop_w / 2)))
        y0 = int(max(0, min(H - crop_h, cy - crop_h / 2)))
        x1 = int(x0 + crop_w)
        y1 = int(y0 + crop_h)

        cropped = Image.fromarray(base[y0:y1, x0:x1])
        return np.array(cropped.resize((W, H), Image.LANCZOS))

    return VideoClip(make_frame, duration=duration)


# --------------------------------------------------------------------------
# Text rendering
# --------------------------------------------------------------------------
def wrap_text(text, max_chars=20):
    if len(text) <= max_chars:
        return [text]
    words = text.split()
    lines, current = [], ""
    for word in words:
        candidate = (current + " " + word).strip()
        if len(candidate) > max_chars and current:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def make_text_image(text, font_size):
    """White text with black shadow on a transparent RGBA canvas."""
    lines = wrap_text(text, 20)
    font = find_font(font_size)

    dummy = Image.new("RGBA", (10, 10))
    draw = ImageDraw.Draw(dummy)

    line_widths, line_heights = [], []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        line_widths.append(bbox[2] - bbox[0])
        line_heights.append(bbox[3] - bbox[1])

    spacing = int(font_size * 0.35)
    total_h = sum(line_heights) + spacing * (len(lines) - 1)
    total_w = max(line_widths)
    pad = max(30, int(font_size * 0.4))
    shadow = max(3, int(font_size * 0.06))

    canvas = Image.new(
        "RGBA",
        (total_w + pad * 2 + shadow, total_h + pad * 2 + shadow),
        (0, 0, 0, 0),
    )
    draw = ImageDraw.Draw(canvas)

    y = pad
    for line, lw, lh in zip(lines, line_widths, line_heights):
        x = pad + (total_w - lw) // 2
        draw.text((x + shadow, y + shadow), line, font=font, fill=(0, 0, 0, 220))
        draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
        y += lh + spacing

    return np.array(canvas)


# --------------------------------------------------------------------------
# Scene assembly
# --------------------------------------------------------------------------
def build_scene(spec, index, total):
    duration = spec["duration"]
    img_path = os.path.join(BASE_DIR, spec["img"])
    preview = spec["text"][:45] + ("…" if len(spec["text"]) > 45 else "")
    print(f"[scene {index}/{total}] {spec['img']}  {duration}s — {preview}")

    pil_img = load_image_filled(img_path)
    background = ken_burns_clip(pil_img, duration)

    text_arr = make_text_image(spec["text"], spec["font_size"])
    text_clip = ImageClip(text_arr).set_duration(duration)
    y_pos = int(HEIGHT * 0.75) - text_clip.h // 2
    text_clip = text_clip.set_position(("center", y_pos)).fadein(0.5)

    return CompositeVideoClip(
        [background, text_clip], size=(WIDTH, HEIGHT)
    ).set_duration(duration)


def build_audio(total_duration):
    tracks = []

    music_path = os.path.join(BASE_DIR, "musica.mp3")
    if os.path.exists(music_path):
        print("[audio] Loading musica.mp3 (background, 40% vol)")
        try:
            music = AudioFileClip(music_path)
            if music.duration > total_duration:
                music = music.subclip(0, total_duration)
            music = music.volumex(0.4).audio_fadein(1.0).audio_fadeout(2.0)
            tracks.append(music)
        except Exception as e:
            print(f"[warn] Could not load musica.mp3: {e}")
    else:
        print("[warn] musica.mp3 not found — no background music.")

    voice_path = os.path.join(BASE_DIR, "veuenoff.mp3")
    if os.path.exists(voice_path):
        print("[audio] Loading veuenoff.mp3 (voiceover, 100% vol)")
        try:
            voice = AudioFileClip(voice_path)
            if voice.duration > total_duration:
                voice = voice.subclip(0, total_duration)
            tracks.append(voice)
        except Exception as e:
            print(f"[warn] Could not load veuenoff.mp3: {e}")

    if not tracks:
        return None
    return CompositeAudioClip(tracks) if len(tracks) > 1 else tracks[0]


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------
def main():
    print(f"[trailer] {WIDTH}x{HEIGHT} @ {FPS}fps — {len(SCENES)} scenes")

    clips = []
    for i, spec in enumerate(SCENES, start=1):
        scene = build_scene(spec, i, len(SCENES))
        if clips:
            scene = scene.crossfadein(CROSSFADE)
        clips.append(scene)

    print(f"[compose] Concatenating with {CROSSFADE}s crossfades")
    video = concatenate_videoclips(clips, method="compose", padding=-CROSSFADE)

    audio = build_audio(video.duration)
    if audio is not None:
        video = video.set_audio(audio)

    output_path = os.path.join(BASE_DIR, OUTPUT_NAME)
    print(f"[render] Writing {OUTPUT_NAME}  (~{video.duration:.1f}s)")
    video.write_videofile(
        output_path,
        fps=FPS,
        codec="libx264",
        audio_codec="aac",
        preset="medium",
        threads=4,
        temp_audiofile=os.path.join(BASE_DIR, "__trailer_audio.m4a"),
        remove_temp=True,
    )
    print(f"[done] {output_path}")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n[abort] interrupted by user")
        sys.exit(130)
    except Exception as e:
        print(f"[error] {type(e).__name__}: {e}")
        traceback.print_exc()
        sys.exit(1)
