# Re-prints the public-domain Piranesi plate in four flat inks.
import sys
from PIL import Image, ImageFilter, ImageOps
src=Image.open(sys.argv[1]).convert('L'); outdir=sys.argv[2]
inks=[(0x24,0x18,0x0f),(0x7c,0x35,0x22),(0xcf,0x8f,0x3a),(0xf0,0xe2,0xc4)]
flat=sum(inks,())+(0,)*(768-12)
def poster(box,name,width,q=80):
    im=src.crop(box)
    im=im.resize((width,round(width*im.height/im.width)),Image.LANCZOS)
    im=im.filter(ImageFilter.GaussianBlur(width/1600))
    im=ImageOps.autocontrast(im,cutoff=0.5)
    im=im.point(lambda v:int(255*(v/255)**0.72))
    p=im.point([min(3,v*4//256) for v in range(256)]).convert('P'); p.putpalette(flat)
    p.convert('RGB').save(f'{outdir}/{name}','WEBP',lossless=True,quality=100,method=6); print(name,p.size)
poster((160,840,2300,1760),'drawbridge-wide.webp',2400)
poster((160,840,2300,1760),'drawbridge-wide-1200.webp',1200)
poster((900,350,2300,2350),'drawbridge-tall.webp',1200)
poster((160,140,2300,3020),'drawbridge-plate.webp',1400)
