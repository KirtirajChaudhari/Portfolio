"""Seam check for public/frames: consecutive-frame difference around the ring,
and which ring frame is closest to center.webp. Prints a table and writes a
contact sheet to docs/shots/character/seam-sheet.jpg.  python scripts/frame_seam.py"""
import json, os
import cv2
import numpy as np

D = 'public/frames'
HEAD = (560, 1360, 60, 800)          # x0, x1, y0, y1 in the 1920x1080 frame
def load(name):
    f = cv2.imread(f'{D}/{name}.webp')
    x0, x1, y0, y1 = HEAD
    return cv2.resize(f[y0:y1, x0:x1], (200, 185)).astype(np.float32)

ring = [load(f'frame-{k:02d}') for k in range(64)]
center = load('center')
diff = [float(np.abs(ring[(k + 1) % 64] - ring[k]).mean()) for k in range(64)]
med = float(np.median(diff))
print('median consecutive diff %.2f' % med)
for k in sorted(range(64), key=lambda k: -diff[k])[:8]:
    print(f'  {k:2d} -> {(k + 1) % 64:2d}: {diff[k]:.2f}  ({diff[k] / med:.1f}x median)')
to_center = [float(np.abs(r - center).mean()) for r in ring]
best = int(np.argmin(to_center))
print('nearest ring frame to center.webp: %d (diff %.2f; median ring diff to center %.2f)' % (best, to_center[best], float(np.median(to_center))))

os.makedirs('docs/shots/character', exist_ok=True)
ks = list(range(54, 64)) + [0, 1, 2]
tiles = []
for k in ks:
    t = cv2.resize(ring[k].astype(np.uint8), (200, 185)).copy()
    cv2.putText(t, str(k), (6, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2); tiles.append(t)
t = center.astype(np.uint8).copy(); cv2.putText(t, 'center', (6, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2); tiles.append(t)
b = ring[best].astype(np.uint8).copy(); cv2.putText(b, 'nearest %d' % best, (6, 22), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2); tiles.append(b)
while len(tiles) % 5: tiles.append(np.zeros_like(tiles[0]))
cv2.imwrite('docs/shots/character/seam-sheet.jpg', np.vstack([np.hstack(tiles[i:i + 5]) for i in range(0, len(tiles), 5)]))
json.dump({'nearestToCenter': best, 'diff': [round(d, 2) for d in diff]}, open('docs/shots/character/seam.json', 'w'))
