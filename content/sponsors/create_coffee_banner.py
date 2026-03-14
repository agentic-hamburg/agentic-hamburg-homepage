#!/usr/bin/env python3
"""
Create a coffee stand banner PDF for Agentic Conf Hamburg.
160cm x 80cm, salmon background, Agentic Conf logo centered, sponsor logos scattered around it.
"""

from PIL import Image
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas
import os
import numpy as np
import random

WIDTH_CM = 160
HEIGHT_CM = 80
DPI = 150
WIDTH_PX = int(WIDTH_CM / 2.54 * DPI)
HEIGHT_PX = int(HEIGHT_CM / 2.54 * DPI)

SALMON = (212, 165, 154)

BASE = os.path.dirname(os.path.abspath(__file__))
OUT_PNG = os.path.join(BASE, "coffee-banner.png")
OUT_PDF = os.path.join(BASE, "coffee-banner.pdf")

random.seed(42)


def remove_white_bg(img, threshold=240):
    arr = np.array(img)
    white_mask = (arr[:, :, 0] > threshold) & (arr[:, :, 1] > threshold) & (arr[:, :, 2] > threshold)
    arr[white_mask, 3] = 0
    return Image.fromarray(arr)


def load_and_resize(path, max_w, max_h, bg_threshold=240):
    img = Image.open(path).convert("RGBA")
    img = remove_white_bg(img, threshold=bg_threshold)
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
    w, h = img.size
    scale = min(max_w / w, max_h / h)
    return img.resize((int(w * scale), int(h * scale)), Image.LANCZOS)


def create_banner():
    banner = Image.new("RGB", (WIDTH_PX, HEIGHT_PX), SALMON)

    # Center logo
    logo = load_and_resize(os.path.join(BASE, "agentic-conf-logo.png"),
                           int(WIDTH_PX * 0.28), int(HEIGHT_PX * 0.55))
    logo_x = (WIDTH_PX - logo.size[0]) // 2
    logo_y = (HEIGHT_PX - logo.size[1]) // 2 - int(HEIGHT_PX * 0.04)
    banner.paste(logo, (logo_x, logo_y), logo)

    # Sponsor logos — bigger now
    sponsor_max_w = int(WIDTH_PX * 0.18)
    sponsor_max_h = int(HEIGHT_PX * 0.15)

    def load_sponsor(filename, thresh=240):
        return load_and_resize(os.path.join(BASE, filename), sponsor_max_w, sponsor_max_h, bg_threshold=thresh)

    # Load all sponsors
    adesso = load_sponsor("adesso-insurance-solutions_rgb.png")
    afc = load_sponsor("afc_rgb.png")
    dl_school = load_sponsor("dl-school_rgb.png")
    hw = load_sponsor("hackersandwizards_long_rgb.png", thresh=245)
    innoq = load_sponsor("innoq_rgb.png")
    tegtmeier = load_sponsor("tegtmeier_rgb.png")
    vorwerk = load_sponsor("vorwerk_rgb.png")

    # Define positions as (cx_fraction, cy_fraction) — center point of each logo
    # Spread across the full banner, avoiding the center logo zone (~0.35-0.65 x, ~0.2-0.8 y)
    # Left side sponsors, right side sponsors, corners
    placements = [
        # (logo, cx%, cy%, jitter_x, jitter_y)
        (innoq,    0.14, 0.18, 30, 20),      # top-left — moved right
        (hw,       0.82, 0.12, 30, 20),       # top-right
        (adesso,   0.18, 0.50, 20, 30),       # middle-left — moved right
        (afc,      0.85, 0.45, 20, 30),       # middle-right
        (vorwerk,  0.82, 0.82, 30, 20),       # bottom-right
        (tegtmeier,0.16, 0.78, 30, 20),       # bottom-left — moved right
        (dl_school,0.50, 0.86, 30, 10),       # bottom-center — moved up
    ]

    for img, cx_frac, cy_frac, jx, jy in placements:
        w, h = img.size
        cx = int(WIDTH_PX * cx_frac) + random.randint(-jx, jx)
        cy = int(HEIGHT_PX * cy_frac) + random.randint(-jy, jy)
        x = cx - w // 2
        y = cy - h // 2
        # Clamp to banner bounds
        x = max(int(WIDTH_PX * 0.02), min(x, WIDTH_PX - w - int(WIDTH_PX * 0.02)))
        y = max(int(HEIGHT_PX * 0.03), min(y, HEIGHT_PX - h - int(HEIGHT_PX * 0.03)))
        banner.paste(img, (x, y), img)

    banner.save(OUT_PNG, "PNG", dpi=(DPI, DPI))
    print(f"Saved PNG: {OUT_PNG} ({banner.size[0]}x{banner.size[1]})")

    c = canvas.Canvas(OUT_PDF, pagesize=(WIDTH_CM * cm, HEIGHT_CM * cm))
    c.drawImage(OUT_PNG, 0, 0, WIDTH_CM * cm, HEIGHT_CM * cm)
    c.save()
    print(f"Saved PDF: {OUT_PDF} ({WIDTH_CM}cm x {HEIGHT_CM}cm)")


if __name__ == "__main__":
    create_banner()
