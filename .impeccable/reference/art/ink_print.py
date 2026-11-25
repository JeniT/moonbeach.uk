# Re-prints a monochrome public-domain image in the site's four flat inks.
# usage: python3 ink_print.py SRC OUT X0 Y0 X1 Y1 WIDTH [GAMMA]
import sys
from PIL import Image, ImageFilter, ImageOps
src, out = sys.argv[1], sys.argv[2]
box = tuple(int(v) for v in sys.argv[3:7]); width = int(sys.argv[7])
gamma = float(sys.argv[8]) if len(sys.argv) > 8 else 0.72
inks = [(0x24,0x18,0x0f),(0x7c,0x35,0x22),(0xcf,0x8f,0x3a),(0xf0,0xe2,0xc4)]
flat = sum(inks, ()) + (0,) * (768 - 12)
im = Image.open(src).convert('L').crop(box)
im = im.resize((width, round(width * im.height / im.width)), Image.LANCZOS)
im = im.filter(ImageFilter.GaussianBlur(width / 1600))
im = ImageOps.autocontrast(im, cutoff=0.5)
im = im.point(lambda v: int(255 * (v / 255) ** gamma))
p = im.point([min(3, v * 4 // 256) for v in range(256)]).convert('P'); p.putpalette(flat)
p.convert('RGB').save(out, 'WEBP', lossless=True, quality=100, method=6)
print(out, p.size)
