#!/usr/bin/env python3
"""
Vertical TikTok / Reels editor.

Takes media files from ./input and produces a finished 9:16 (1080x1920)
video at ./output/reel_final.mp4 with auto-generated subtitles, a layered
audio mix (voice-over + background music) and styled text overlays.

Run:  python3 reel_editor.py
Deps: pip install moviepy==1.0.3 openai-whisper imageio imageio-ffmpeg pillow numpy
"""

import os
import sys

# ======================================================================
# === CONFIG ===
# ======================================================================
INPUT_DIR = "./input"
OUTPUT_DIR = "./output"
USERNAME = "@usuario"
ACCENT_COLOR = (0, 207, 255)      # #00CFFF in RGB
MUSIC_VOLUME = 0.12
VOICEOVER_VOLUME = 1.0
WHISPER_MODEL = "base"            # options: tiny, base, small, medium
OUTPUT_FPS = 30
OUTPUT_RESOLUTION = (1080, 1920)
# ======================================================================
# === END CONFIG ===
# ======================================================================

W, H = OUTPUT_RESOLUTION

# ---------------------------------------------------------------------- #
# Edit timeline. Each segment: file, trim window, text overlay, duration. #
# ---------------------------------------------------------------------- #
EDIT = [
    {"id": 1, "file": "clip_1.mp4", "trim": [0, 4],
     "overlay_title": "No deslices.", "overlay_position": "center", "duration": 4},
    {"id": 2, "file": "clip_1.mp4", "trim": [4, 15],
     "overlay_title": None, "overlay_position": None, "duration": 11},
    {"id": 3, "file": "clip_2.mp4", "trim": [0, 7],
     "overlay_title": "01 — ENCONTRAR", "overlay_position": "top", "duration": 7},
    {"id": 4, "file": "clip_3.mp4", "trim": [0, 8],
     "overlay_title": "02 — CALCULAR MARGEN", "overlay_position": "top", "duration": 8},
    {"id": 5, "file": "clip_4.mp4", "trim": [0, 8],
     "overlay_title": "03 — PUBLICAR", "overlay_position": "top", "duration": 8},
    {"id": 6, "file": "clip_5.mp4", "trim": [0, 7],
     "overlay_title": "04 — REPETIR", "overlay_position": "top", "duration": 7},
    {"id": 7, "file": "black", "trim": None,
     "overlay_title": "Más fácil de entender\nque de ejecutar.",
     "overlay_position": "center", "duration": 8},
    {"id": 8, "file": "black", "trim": None,
     "overlay_title": "SEMANA 0\nLo estoy viviendo.",
     "overlay_position": "center", "duration": 5},
    {"id": 9, "file": "black", "trim": None,
     "overlay_title": USERNAME, "overlay_position": "center", "duration": 2},
]

# Hard cuts everywhere; a 2-frame white flash is added AFTER these segment ids
# (i.e. between segments 3-4, 4-5 and 5-6).
FLASH_AFTER_IDS = {3, 4, 5}

# ---------------------------------------------------------------------- #
# Dependency check                                                       #
# ---------------------------------------------------------------------- #
try:
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
    # moviepy 1.0.3 still references Image.ANTIALIAS, removed in Pillow >= 10.
    if not hasattr(Image, "ANTIALIAS"):
        Image.ANTIALIAS = Image.Resampling.LANCZOS
    from moviepy.editor import (VideoFileClip, ImageClip, ColorClip,
                                CompositeVideoClip, concatenate_videoclips,
                                AudioFileClip, CompositeAudioClip)
    from moviepy.video.fx.crop import crop
    import moviepy.audio.fx.all as afx
except ImportError as exc:
    print("ERROR: missing dependency -> %s" % exc)
    print("Install with:")
    print("  pip install moviepy==1.0.3 openai-whisper imageio "
          "imageio-ffmpeg pillow numpy")
    sys.exit(1)


# ====================================================================== #
# Fonts                                                                  #
# ====================================================================== #
_FONT_CANDIDATES = [
    "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/usr/share/fonts/truetype/freefont/FreeSansBold.ttf",
    "/Library/Fonts/Arial Bold.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
]
_FONT_PATH = next((p for p in _FONT_CANDIDATES if os.path.exists(p)), None)
_font_cache = {}


def load_font(size):
    size = int(size)
    if size not in _font_cache:
        if _FONT_PATH:
            _font_cache[size] = ImageFont.truetype(_FONT_PATH, size)
        else:
            _font_cache[size] = ImageFont.load_default()
    return _font_cache[size]


# ====================================================================== #
# Text rendering (Pillow -> RGBA images)                                  #
# ====================================================================== #
def _measure_dummy():
    return ImageDraw.Draw(Image.new("RGBA", (4, 4)))


def wrap_text(text, font, max_width, draw):
    """Greedy word-wrap into a list of lines that fit max_width."""
    lines, cur = [], ""
    for word in text.split():
        trial = word if not cur else cur + " " + word
        if not cur or draw.textlength(trial, font=font) <= max_width:
            cur = trial
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def _draw_tracked(draw, x, cy, text, font, fill, tracking):
    """Draw text char-by-char with extra letter-spacing, vertically centred."""
    for ch in text:
        draw.text((x, cy), ch, font=font, fill=fill, anchor="lm")
        x += draw.textlength(ch, font=font) + tracking


def make_text_line_image(text, size, color, tracking=0, shadow=True):
    """Render a single line of text to a transparent RGBA image."""
    font = load_font(size)
    d0 = _measure_dummy()
    if tracking:
        text_w = (sum(d0.textlength(c, font=font) for c in text)
                  + tracking * max(len(text) - 1, 0))
    else:
        text_w = d0.textlength(text, font=font)
    ascent, descent = font.getmetrics()
    text_h = ascent + descent

    pad = max(12, size // 5)
    off = 3
    img_w = int(text_w) + 2 * pad + off
    img_h = int(text_h) + 2 * pad + off
    img = Image.new("RGBA", (img_w, img_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    cy = pad + text_h / 2.0
    if shadow:
        if tracking:
            _draw_tracked(d, pad + off, cy + off, text, font, (0, 0, 0, 150), tracking)
        else:
            d.text((pad + text_w / 2.0 + off, cy + off), text, font=font,
                   fill=(0, 0, 0, 150), anchor="mm")
    fill = tuple(color) + (255,)
    if tracking:
        _draw_tracked(d, pad, cy, text, font, fill, tracking)
    else:
        d.text((pad + text_w / 2.0, cy), text, font=font, fill=fill, anchor="mm")
    return img


def make_subtitle_image(text):
    """Render a subtitle block: white text on a 65%-opaque black box."""
    font = load_font(52)
    pad_x, pad_y = 20, 10
    d0 = _measure_dummy()
    max_text_w = int(W * 0.86) - 2 * pad_x
    lines = wrap_text(text, font, max_text_w, d0)[:2]   # max 2 lines

    ascent, descent = font.getmetrics()
    line_h = ascent + descent
    widths = [d0.textlength(ln, font=font) for ln in lines]
    text_w = max(widths) if widths else 0

    box_w = int(text_w) + 2 * pad_x
    box_h = line_h * len(lines) + 2 * pad_y
    img = Image.new("RGBA", (box_w, box_h), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.rectangle([0, 0, box_w - 1, box_h - 1],
                fill=(0, 0, 0, int(round(255 * 0.65))))
    for i, ln in enumerate(lines):
        cy = pad_y + line_h * i + line_h / 2.0
        d.text((box_w / 2.0, cy), ln, font=font,
               fill=(255, 255, 255, 255), anchor="mm")
    return img


def pil_to_clip(img, duration):
    return ImageClip(np.array(img)).set_duration(duration)


# ====================================================================== #
# Film grain                                                              #
# ====================================================================== #
_NOISE_BANK = None


def _noise_bank():
    global _NOISE_BANK
    if _NOISE_BANK is None:
        rng = np.random.default_rng(42)
        _NOISE_BANK = [rng.integers(0, 256, size=(H, W), dtype=np.uint8)
                       for _ in range(16)]
    return _NOISE_BANK


def add_grain(clip):
    """Blend a subtle 3%-opacity monochrome noise overlay over every frame."""
    bank = _noise_bank()
    n = len(bank)

    def _fl(get_frame, t):
        frame = get_frame(t).astype(np.float32)
        noise = bank[int(t * OUTPUT_FPS) % n].astype(np.float32)[:, :, None]
        out = frame * 0.97 + noise * 0.03
        return np.clip(out, 0, 255).astype(np.uint8)

    return clip.fl(_fl)


# ====================================================================== #
# Visual processing                                                       #
# ====================================================================== #
def resize_crop_cover(clip):
    """Scale to fully cover 1080x1920, then centre-crop to exact size."""
    cw, ch = clip.size
    scale = max(W / cw, H / ch)
    r = clip.resize(scale)
    rw, rh = r.size
    r = crop(r, width=W, height=H, x_center=rw / 2.0, y_center=rh / 2.0)
    if tuple(r.size) != (W, H):
        r = r.resize(newsize=(W, H))
    return r


def fit_duration(clip, duration):
    """Force a video clip to an exact duration (trim, or freeze last frame)."""
    if clip.duration is None:
        return clip.set_duration(duration)
    if clip.duration >= duration - 1e-3:
        return clip.subclip(0, duration)
    tail = (clip.to_ImageClip(t=max(clip.duration - 0.04, 0))
            .set_duration(duration - clip.duration))
    return concatenate_videoclips([clip, tail], method="compose")


def make_video_clip(path, trim, duration):
    clip = VideoFileClip(path)
    start, end = (trim or [0, duration])
    start = max(0.0, min(float(start), clip.duration))
    end = min(float(end), clip.duration)
    if end <= start:
        end = clip.duration
    sub = clip.subclip(start, end)
    sub = resize_crop_cover(sub)
    sub = fit_duration(sub, duration)
    return sub.without_audio()


def make_photo_clip(path, duration):
    """Static photo with a subtle Ken Burns slow zoom (1.0 -> 1.02x)."""
    base = ImageClip(path).set_duration(duration)
    base = resize_crop_cover(base)
    zoom = base.resize(lambda t: 1.0 + 0.02 * (t / duration))
    zoom = zoom.set_position(("center", "center"))
    return CompositeVideoClip([zoom], size=OUTPUT_RESOLUTION).set_duration(duration)


def make_black_clip(duration):
    return ColorClip(OUTPUT_RESOLUTION, color=(0, 0, 0)).set_duration(duration)


def make_missing_clip(filename, duration):
    """Placeholder for a missing input file."""
    base = make_black_clip(duration)
    img = make_text_line_image("[CLIP MISSING: %s]" % filename, 40,
                               (255, 255, 255))
    label = pil_to_clip(img, duration).set_position("center")
    return CompositeVideoClip([base, label], size=OUTPUT_RESOLUTION) \
        .set_duration(duration)


# ====================================================================== #
# Text overlays                                                           #
# ====================================================================== #
def apply_overlay(base, seg):
    """Composite the segment's title overlay (if any) on top of the base."""
    title = seg.get("overlay_title")
    if not title:
        return base
    pos = seg.get("overlay_position")
    duration = seg["duration"]
    is_black = seg["file"] == "black"
    overlays = []

    if pos == "top":
        img = make_text_line_image(title, 38, ACCENT_COLOR, tracking=8)
        clip = pil_to_clip(img, duration)
        x = (W - img.width) // 2
        y = int(0.08 * H)
        overlays.append(clip.set_position((x, y)))
    else:  # "center"
        lines = title.split("\n")
        multiline = len(lines) > 1
        size = 58 if multiline else 72
        spacing = int(size * 1.3)
        total_h = spacing * len(lines)
        for i, ln in enumerate(lines):
            img = make_text_line_image(ln, size, (255, 255, 255))
            clip = pil_to_clip(img, duration)
            cy = H / 2.0 - total_h / 2.0 + spacing * i + spacing / 2.0
            x = (W - img.width) // 2
            y = int(cy - img.height / 2.0)
            clip = clip.set_position((x, y))
            if is_black:
                # animate: each line pops in 400ms after the previous one
                clip = clip.set_start(0.4 * i).set_end(duration)
            overlays.append(clip)

    return CompositeVideoClip([base] + overlays,
                              size=OUTPUT_RESOLUTION).set_duration(duration)


# ====================================================================== #
# Segment builder                                                         #
# ====================================================================== #
IMAGE_EXTS = (".jpg", ".jpeg", ".png", ".bmp", ".webp")


def build_segment(seg):
    filename = seg["file"]
    duration = seg["duration"]

    if filename == "black":
        base = make_black_clip(duration)
    else:
        path = os.path.join(INPUT_DIR, filename)
        if not os.path.exists(path):
            print("  ! missing file: %s -> placeholder" % filename)
            base = make_missing_clip(filename, duration)
        elif filename.lower().endswith(IMAGE_EXTS):
            base = add_grain(make_photo_clip(path, duration))
        else:
            base = add_grain(make_video_clip(path, seg.get("trim"), duration))

    base = base.set_duration(duration)
    return apply_overlay(base, seg).set_duration(duration)


# ====================================================================== #
# Subtitles                                                               #
# ====================================================================== #
def transcribe_voiceover(path):
    """Transcribe with Whisper -> flat list of word dicts {start,end,text}."""
    import whisper
    print("Transcribing voice-over with Whisper (model=%s)..." % WHISPER_MODEL)
    model = whisper.load_model(WHISPER_MODEL)
    result = model.transcribe(path, word_timestamps=True, verbose=False)
    words = []
    for seg in result.get("segments", []):
        for w in seg.get("words", []):
            txt = (w.get("word") or "").strip()
            if txt:
                words.append({"start": float(w["start"]),
                              "end": float(w["end"]), "text": txt})
    return words


def group_subtitles(words, max_words=5, max_seconds=2.0):
    """Group words into subtitle blocks of <=5 words or <=2 seconds."""
    blocks, cur = [], []

    def flush():
        if cur:
            blocks.append({"start": cur[0]["start"],
                           "end": cur[-1]["end"],
                           "text": " ".join(w["text"] for w in cur)})

    for w in words:
        if cur and (len(cur) >= max_words
                    or (w["end"] - cur[0]["start"]) > max_seconds):
            flush()
            cur = []
        cur.append(w)
    flush()
    return blocks


def _srt_time(t):
    ms = int(round(max(t, 0) * 1000))
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return "%02d:%02d:%02d,%03d" % (h, m, s, ms)


def write_srt(blocks, path):
    with open(path, "w", encoding="utf-8") as f:
        for i, b in enumerate(blocks, 1):
            f.write("%d\n%s --> %s\n%s\n\n" % (
                i, _srt_time(b["start"]), _srt_time(b["end"]), b["text"]))


def build_subtitle_clips(blocks, video_duration):
    clips = []
    for b in blocks:
        if b["start"] >= video_duration:
            continue
        end = min(b["end"], video_duration)
        d = end - b["start"]
        if d <= 0:
            continue
        img = make_subtitle_image(b["text"])
        y = int(H * 0.9 - img.height / 2.0)   # sits in the bottom 15%
        clips.append(pil_to_clip(img, d)
                     .set_start(b["start"])
                     .set_position(("center", y)))
    return clips


# ====================================================================== #
# Audio                                                                   #
# ====================================================================== #
def build_music_track(path, video_duration):
    music = AudioFileClip(path)
    if music.duration < video_duration:
        music = afx.audio_loop(music, duration=video_duration)
    else:
        music = music.subclip(0, video_duration)
    music = afx.volumex(music, MUSIC_VOLUME)
    music = afx.audio_fadein(music, 1.0)
    music = afx.audio_fadeout(music, 2.0)
    return music


# ====================================================================== #
# Helpers                                                                 #
# ====================================================================== #
def find_input(basename, extensions):
    for ext in extensions:
        p = os.path.join(INPUT_DIR, basename + ext)
        if os.path.exists(p):
            return p
    return None


# ====================================================================== #
# Main pipeline                                                           #
# ====================================================================== #
def main():
    print("=" * 60)
    print("  VERTICAL REEL EDITOR  (%dx%d @ %dfps)" % (W, H, OUTPUT_FPS))
    print("=" * 60)
    os.makedirs(INPUT_DIR, exist_ok=True)
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # --- 1. Voice-over + subtitles ----------------------------------- #
    voiceover_path = find_input("voiceover", [".mp3", ".wav", ".m4a"])
    music_path = find_input("music", [".mp3", ".wav"])
    srt_path = os.path.join(OUTPUT_DIR, "subtitles.srt")

    blocks = []
    if voiceover_path:
        try:
            words = transcribe_voiceover(voiceover_path)
            blocks = group_subtitles(words)
            write_srt(blocks, srt_path)
            print("  -> %d words, %d subtitle blocks -> %s"
                  % (len(words), len(blocks), srt_path))
        except Exception as exc:
            print("  ! transcription failed (%s) -> continuing without "
                  "subtitles" % exc)
            blocks = []
            write_srt([], srt_path)
    else:
        print("  ! no voiceover file found -> skipping subtitles")
        write_srt([], srt_path)

    # --- 2. Build every segment -------------------------------------- #
    segments = []
    for i, seg in enumerate(EDIT, 1):
        print("Processing segment %d/%d  (id=%d, file=%s, %ss)..."
              % (i, len(EDIT), seg["id"], seg["file"], seg["duration"]))
        segments.append(build_segment(seg))

    # --- 3. Concatenate (hard cuts) ---------------------------------- #
    video = concatenate_videoclips(segments, method="compose")
    video = video.set_duration(sum(s["duration"] for s in EDIT))
    total_duration = video.duration

    # --- 4. White flashes between segments 3-4-5-6 ------------------- #
    flashes = []
    t = 0.0
    for seg in EDIT:
        t += seg["duration"]
        if seg["id"] in FLASH_AFTER_IDS:
            flashes.append(
                ColorClip(OUTPUT_RESOLUTION, color=(255, 255, 255))
                .set_duration(2.0 / OUTPUT_FPS).set_start(t))

    # --- 5. Subtitles ------------------------------------------------ #
    subtitle_clips = build_subtitle_clips(blocks, total_duration)

    final = CompositeVideoClip([video] + flashes + subtitle_clips,
                               size=OUTPUT_RESOLUTION)
    final = final.set_duration(total_duration)

    # --- 6. Audio mix ------------------------------------------------ #
    tracks = []
    if voiceover_path:
        vo = AudioFileClip(voiceover_path)
        if vo.duration > total_duration:
            vo = vo.subclip(0, total_duration)
        tracks.append(afx.volumex(vo, VOICEOVER_VOLUME))
    else:
        print("  ! no voiceover -> music only")
    if music_path:
        tracks.append(build_music_track(music_path, total_duration))
    else:
        print("  ! no music file found -> continuing without background music")

    if tracks:
        final = final.set_audio(
            CompositeAudioClip(tracks).set_duration(total_duration))

    # --- 7. Export --------------------------------------------------- #
    out_path = os.path.join(OUTPUT_DIR, "reel_final.mp4")
    print("Rendering -> %s ..." % out_path)
    final.write_videofile(
        out_path,
        fps=OUTPUT_FPS,
        codec="libx264",
        audio_codec="aac",
        bitrate="8000k",
        audio_bitrate="192k",
        preset="medium",
        threads=4,
        temp_audiofile=os.path.join(OUTPUT_DIR, "_temp_audio.m4a"),
        remove_temp=True,
    )

    # --- 8. Summary -------------------------------------------------- #
    print("=" * 60)
    print("  DONE")
    print("  Segments processed : %d" % len(EDIT))
    print("  Subtitle blocks    : %d" % len(blocks))
    print("  Total duration     : %.2f s" % total_duration)
    print("  Video              : %s" % out_path)
    print("  Subtitles          : %s" % srt_path)
    print("=" * 60)


if __name__ == "__main__":
    main()
