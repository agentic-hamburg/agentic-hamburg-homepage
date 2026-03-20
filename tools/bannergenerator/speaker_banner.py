#!/usr/bin/env python3
"""Generate speaker spotlight banners programmatically using Pillow."""

import sys
from PIL import Image, ImageDraw, ImageFont

# Config
W, H = 1536, 864
BG = (251, 157, 161)  # #FB9DA1
TEAL = (27, 75, 90)   # #1B4B5A

FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_REG = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_ITALIC = "/System/Library/Fonts/Supplemental/Arial Bold Italic.ttf"


def make_circle_photo(photo_path, size=280):
    """Crop photo into a circle with a thin teal border."""
    photo = Image.open(photo_path).convert("RGBA")
    photo = photo.resize((size, size), Image.LANCZOS)

    # Create circular mask
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, size, size), fill=255)
    photo.putalpha(mask)

    # Draw border ring
    border = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(border)
    draw.ellipse((0, 0, size - 1, size - 1), outline=TEAL, width=2)
    photo = Image.alpha_composite(photo, border)

    return photo


def generate_speaker_banner(
    output_path,
    photo_path,
    logo_path,
    speaker_name,
    speaker_title,
    talk_lines,
    conf_line="Agentic Conf Hamburg \u00b7 March 22, 2026",
    url_line="https://agentic.hamburg",
):
    # Create canvas
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # Load fonts
    font_name = ImageFont.truetype(FONT_BOLD, 62)
    font_title = ImageFont.truetype(FONT_REG, 34)
    font_talk = ImageFont.truetype(FONT_ITALIC, 38)
    font_small = ImageFont.truetype(FONT_REG, 24)

    # Place logo (top-right)
    logo = Image.open(logo_path).convert("RGBA")
    logo_h = 140
    logo_w = int(logo.width * logo_h / logo.height)
    logo = logo.resize((logo_w, logo_h), Image.LANCZOS)
    img.paste(logo, (W - logo_w - 40, 30), logo)

    # --- Measure text widths to compute total content width ---
    circle_size = 420
    gap_photo_text = 70
    talk_line_h = 50

    # Find widest text line
    name_w = draw.textlength(speaker_name, font=font_name)
    title_w = draw.textlength(speaker_title, font=font_title)
    talk_ws = [draw.textlength(line, font=font_talk) for line in talk_lines]
    info_w = draw.textlength(conf_line, font=font_small)
    url_w = draw.textlength(url_line, font=font_small)
    max_text_w = max(name_w, title_w, *talk_ws, info_w, url_w)

    # Total content width and horizontal centering
    content_w = circle_size + gap_photo_text + max_text_w
    content_left = (W - content_w) // 2

    # Vertical: calculate text block height
    text_block_h = 62 + 14 + 34 + 46 + (len(talk_lines) * talk_line_h) + 50 + 24 + 6 + 24
    content_h = max(circle_size, text_block_h)
    content_top = (H - content_h) // 2

    # Place circular photo
    photo = make_circle_photo(photo_path, circle_size)
    photo_x = int(content_left)
    photo_y = content_top + (content_h - circle_size) // 2
    img.paste(photo, (photo_x, photo_y), photo)

    # Text block
    tx = int(content_left + circle_size + gap_photo_text)
    text_y = content_top + (content_h - text_block_h) // 2

    # Speaker name
    draw.text((tx, text_y), speaker_name, fill=TEAL, font=font_name)

    # Speaker title
    title_y = text_y + 76
    draw.text((tx, title_y), speaker_title, fill=TEAL, font=font_title)

    # Talk title (multiple lines)
    talk_y = title_y + 80
    for line in talk_lines:
        draw.text((tx, talk_y), line, fill=TEAL, font=font_talk)
        talk_y += talk_line_h

    # Conference info
    info_y = talk_y + 50
    draw.text((tx, info_y), conf_line, fill=TEAL, font=font_small)
    draw.text((tx, info_y + 30), url_line, fill=TEAL, font=font_small)

    img.save(output_path, "PNG")
    print(output_path)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Generate speaker banner")
    parser.add_argument("--output", required=True)
    parser.add_argument("--photo", required=True)
    parser.add_argument("--logo", required=True)
    parser.add_argument("--name", required=True)
    parser.add_argument("--title", required=True)
    parser.add_argument("--talk", required=True, nargs="+", help="Talk title lines")
    args = parser.parse_args()

    generate_speaker_banner(
        output_path=args.output,
        photo_path=args.photo,
        logo_path=args.logo,
        speaker_name=args.name,
        speaker_title=args.title,
        talk_lines=args.talk,
    )
