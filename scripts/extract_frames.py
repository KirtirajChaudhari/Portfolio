"""Pre-extract the head-rotation frames from public/character.mp4.

Why: the MP4 has one keyframe, so in-browser seeking stalls and play() runs
uncontrolled. The page instead draws pre-decoded WebP frames on a canvas.

Run from the repo root:  python scripts/extract_frames.py
Writes public/frames/frame-00..63.webp, public/frames/center.webp and
public/frames/manifest.json (background colours, face centre, frame size).
"""
import json
import math
import os

import cv2
import numpy as np

SRC = 'public/character.mp4'
OUT = 'public/frames'
N = 64                    # 360 / 64 = 5.625 degrees per frame
QUALITY = 82
CENTER_FRAME = 232        # neutral, eyes open, looking into the camera

# Compass -> video frame, read off the contact sheet (see the README note).
# Angles are screen angles, y down, so they increase clockwise: UP is -90.
# The video turns the head UP -> UP-RIGHT -> RIGHT -> DOWN-RIGHT -> DOWN ->
# DOWN-LEFT -> LEFT -> UP-LEFT and then settles to neutral.
KEYS = [
    (-90, 30),    # UP
    (-45, 52),    # UP-RIGHT
    (0, 72),      # RIGHT
    (45, 94),     # DOWN-RIGHT
    (90, 122),    # DOWN
    (135, 152),   # DOWN-LEFT
    (180, 168),   # LEFT
    (225, 186),   # UP-LEFT
]
# UP-LEFT (225) back round to UP (270): 7 slots (k57..k63). The first take bridged
# with duplicate frames and jumped from "turned left" straight to "facing up". The
# video's own return path goes UP-LEFT -> neutral (frames 198-210) -> lift to UP
# (frames 15-28). Frames 5-12 and ~190-197 are blinks/winks and are skipped.
BRIDGE = [200, 206, 0, 15, 20, 25, 28]


def frame_for(angle: float) -> int:
    a = angle
    if a < -90:
        a += 360
    if a > 225:
        j = round((a - 225) / (360.0 / N))          # 1..7
        return BRIDGE[min(len(BRIDGE), max(1, j)) - 1]
    for (a0, f0), (a1, f1) in zip(KEYS, KEYS[1:]):
        if a0 <= a <= a1:
            return round(f0 + (f1 - f0) * (a - a0) / (a1 - a0))
    return KEYS[0][1]


def read_all():
    cap = cv2.VideoCapture(SRC)
    frames = []
    while True:
        ok, f = cap.read()
        if not ok:
            break
        frames.append(f)
    return frames


def sparkle_mask(frame):
    """The generator's star watermark, bottom-right. Fixed position."""
    g = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY).astype(np.int16)
    blur = cv2.GaussianBlur(g, (0, 0), 25).astype(np.int16)
    m = ((g - blur) > 14).astype(np.uint8)
    m[:, :1500] = 0
    m[:700, :] = 0
    return cv2.dilate(m, np.ones((9, 9), np.uint8))


def cursor_mask(frame):
    """Stray mouse arrows from the screen recording. Only small near-white
    blobs that sit entirely on the red background are removed, so glasses
    glints on the face are never touched. Returns (mask, blobs_on_character)."""
    b, g, r = [frame[..., i].astype(np.int16) for i in range(3)]
    # Compression greys the arrow, so test "not red" rather than "pure white".
    white = ((np.minimum(b, g) > 95) & (r > 110)).astype(np.uint8)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(white, connectivity=8)
    mask = np.zeros_like(white)
    on_char = 0
    H, W = white.shape
    for i in range(1, n):
        x, y, w, h, area = stats[i]
        if area < 4 or area > 900 or w > 50 or h > 50:
            continue
        # Work in a small window: full-frame dilates per blob are far too slow.
        x0, y0, x1, y1 = max(x - 12, 0), max(y - 12, 0), min(x + w + 12, W), min(y + h + 12, H)
        blob = (lab[y0:y1, x0:x1] == i).astype(np.uint8)
        ring = cv2.dilate(blob, np.ones((15, 15), np.uint8)) - cv2.dilate(blob, np.ones((5, 5), np.uint8))
        px = frame[y0:y1, x0:x1][ring > 0].astype(np.int16)
        red_bg = ((px[:, 2] - np.maximum(px[:, 0], px[:, 1])) > 90).mean() if len(px) else 0
        if red_bg > 0.8:
            mask[y0:y1, x0:x1] |= cv2.dilate(blob, np.ones((11, 11), np.uint8))
        else:
            on_char += 1
    return mask, on_char


def clean(frame, spark):
    cur, on_char = cursor_mask(frame)
    m = cv2.bitwise_or(spark, cur)
    return cv2.inpaint(frame, m, 5, cv2.INPAINT_TELEA), int(cur.any()), on_char


def main():
    os.makedirs(OUT, exist_ok=True)
    frames = read_all()
    h, w = frames[0].shape[:2]
    spark = sparkle_mask(frames[0])

    wanted = []
    for k in range(N):
        angle = -90 + k * 360.0 / N
        wanted.append((k, angle, frame_for(angle)))

    report = []
    for k, angle, src in wanted:
        img, had_cursor, on_char = clean(frames[src], spark)
        cv2.imwrite(f'{OUT}/frame-{k:02d}.webp', img, [cv2.IMWRITE_WEBP_QUALITY, QUALITY])
        report.append((k, round(angle, 1), src, had_cursor, on_char))

    c, _, _ = clean(frames[CENTER_FRAME], spark)
    cv2.imwrite(f'{OUT}/center.webp', c, [cv2.IMWRITE_WEBP_QUALITY, QUALITY])

    # Background: median of the border, plus centre/edge for a CSS gradient.
    edge = np.concatenate([c[:6].reshape(-1, 3), c[-6:].reshape(-1, 3),
                           c[:, :6].reshape(-1, 3), c[:, -6:].reshape(-1, 3)])
    edge_rgb = np.median(edge, axis=0)[::-1].astype(int)
    mid_rgb = c[400, 520][::-1].astype(int)

    # Face centre: centroid of skin pixels inside the head box of the neutral frame.
    hsv = cv2.cvtColor(c[60:720, 560:1360], cv2.COLOR_BGR2HSV)
    hh, ss, vv = hsv[..., 0].astype(int), hsv[..., 1].astype(int), hsv[..., 2].astype(int)
    ys, xs = np.nonzero((hh >= 6) & (hh <= 22) & (ss > 70) & (ss < 215) & (vv > 110))
    fx, fy = (xs.mean() + 560) / w, (ys.mean() + 60) / h

    # Ring frame whose head crop is closest to the neutral pose: the runtime enters
    # and leaves the centre pose through it, so the swap is never a teleport.
    crop = lambda im: cv2.resize(im[60:800, 560:1360], (200, 185)).astype(np.float32)
    cc = crop(c)
    near = min(range(N), key=lambda k: float(np.abs(crop(cv2.imread(f'{OUT}/frame-{k:02d}.webp')) - cc).mean()))

    hexc = lambda a: '#%02x%02x%02x' % tuple(int(x) for x in a)
    manifest = {
        'frames': N, 'width': w, 'height': h,
        'bgEdge': hexc(edge_rgb), 'bgMid': hexc(mid_rgb),
        'face': {'x': round(float(fx), 4), 'y': round(float(fy), 4)},
        'nearestToCenter': near,
        'map': [{'k': k, 'angle': a, 'src': s} for k, a, s, _, _ in report],
    }
    with open(f'{OUT}/manifest.json', 'w') as fh:
        json.dump(manifest, fh, indent=1)

    print(f'video: {len(frames)} frames, {w}x{h}')
    print('bg edge', manifest['bgEdge'], 'mid', manifest['bgMid'], 'face', manifest['face'])
    print('cursor blobs removed in', sum(r[3] for r in report), 'frames;',
          'blobs left on character:', [(r[0], r[2], r[4]) for r in report if r[4]])
    print('source frames used:', [r[2] for r in report])


if __name__ == '__main__':
    main()
