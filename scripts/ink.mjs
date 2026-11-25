// Re-prints an image in the site's four flat inks, like the Piranesi plates and the adventure covers.
//
//   npm run ink -- <image> [output] [--width 1400] [--light 0.72]
//
//   <image>     the picture to print, e.g. inspiration/my-cover.jpg
//   [output]    where to save it; defaults to public/art/<same name>.webp
//   --width     how wide to make it, in pixels (default 1400; never larger than the original)
//   --light     below 1 lightens the mid-tones, above 1 darkens them (default 0.72)
//
// It works best on engravings, woodcuts and line drawings. Photos come out like screen prints.
// No AI involved: the picture is turned to grey, its contrast stretched, and every pixel
// sorted into one of four bands of brightness, each printed in one ink.
import sharp from 'sharp';
import { basename, extname, join } from 'node:path';

const INKS = [
  [0x24, 0x18, 0x0f], // ink: dark brown
  [0x7c, 0x35, 0x22], // rust
  [0xcf, 0x8f, 0x3a], // ochre
  [0xf0, 0xe2, 0xc4], // stock: the paper
];

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const [, value] = args.splice(i, 2);
  return Number(value);
};
const width = opt('width', 1400);
const light = opt('light', 0.72);
const [input, output = join('public', 'art', `${basename(input ?? '', extname(input ?? ''))}.webp`)] = args;

if (!input) {
  console.log('Usage: npm run ink -- <image> [output] [--width 1400] [--light 0.72]');
  process.exit(1);
}

// Grey, resized, and softened very slightly so fine hatching doesn't turn to noise.
const { data, info } = await sharp(input)
  .rotate()
  .greyscale()
  .resize({ width, withoutEnlargement: true })
  .blur(Math.max(0.3, width / 1600))
  .raw()
  .toBuffer({ resolveWithObject: true });

// Stretch the contrast, ignoring the darkest and lightest 0.5% of pixels.
const hist = new Array(256).fill(0);
for (const v of data) hist[v]++;
const cut = data.length * 0.005;
let lo = 0, hi = 255;
for (let n = 0; lo < 255 && (n += hist[lo]) <= cut; ) lo++;
for (let n = 0; hi > 0 && (n += hist[hi]) <= cut; ) hi--;
const span = Math.max(1, hi - lo);

// Each pixel: stretch, adjust the mid-tones, then pick one of the four inks.
const out = Buffer.alloc(info.width * info.height * 3);
for (let i = 0; i < data.length; i++) {
  const v = Math.min(1, Math.max(0, (data[i] - lo) / span)) ** light;
  const ink = INKS[Math.min(3, Math.floor(v * 4))];
  out.set(ink, i * 3);
}

await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } })
  .webp({ lossless: true })
  .toFile(output);

console.log(`Printed ${input} in four inks: ${output} (${info.width}×${info.height})`);
console.log('Remember to credit the artist, and check the artwork is public domain or yours to use.');
