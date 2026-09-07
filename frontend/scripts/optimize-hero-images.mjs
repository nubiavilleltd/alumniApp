// Read public carousel images and build local, versioned WebP variants.
// This never uploads or changes CMS content. Run from any directory.
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';
import { loadEnv } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const env = loadEnv('production', root, 'VITE_');
const base = (
  env.VITE_CONTENT_API_BASE_URL?.trim() || 'https://alumniportal.nubiaville.com/blog_api'
).replace(/\/+$/, '');
const apiKey = env.VITE_CONTENT_API_TOKEN || env.VITE_API_TOKEN;
const output = path.join(root, 'public/hero-optimized');
const manifestPath = path.join(root, 'src/features/homepage/data/hero-images.generated.json');

function canonicalUrl(value) {
  const url = new URL(value);
  url.pathname = url.pathname.replace('/./', '/');
  return url.toString();
}

async function download(url, headers = {}) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(45000) });
  if (!response.ok) throw new Error(`Download returned HTTP ${response.status}`);
  return response;
}

try {
  const response = await download(`${base}/homepage`, apiKey ? { 'X-API-Key': apiKey } : {});
  const raw = await response.json();
  const homepage = raw.homepage ?? raw.data ?? raw;
  const images = homepage.carousel_images ?? homepage.carouselImages;
  if (!Array.isArray(images)) throw new Error('Homepage response has no carousel image list.');
  await mkdir(output, { recursive: true });
  await mkdir(path.dirname(manifestPath), { recursive: true });
  const manifest = {};

  for (const image of images) {
    if ([true, 1, '1', 'true'].includes(image.is_hidden ?? image.isHidden)) continue;
    const sourceUrl = image.image_url ?? image.imageUrl;
    if (!sourceUrl) continue;
    const parsed = new URL(sourceUrl);
    if (!['https:', 'http:'].includes(parsed.protocol)) throw new Error('Unsupported image URL.');
    // Do not forward the CMS API key to image hosts.
    const buffer = Buffer.from(await (await download(sourceUrl)).arrayBuffer());
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16);
    const metadata = await sharp(buffer, { limitInputPixels: 40_000_000 }).metadata();
    if (!metadata.width || !metadata.height) throw new Error('Image dimensions unavailable.');
    if ((metadata.pages ?? 1) > 1)
      throw new Error('Animated hero images need manual optimization.');
    const rotated = await sharp(buffer).rotate().toBuffer();
    const oriented = await sharp(rotated).metadata();
    const widths = [
      ...new Set([640, 960, 1280, 1600, 1920].map((w) => Math.min(w, oriented.width))),
    ];
    const variants = [];
    for (const width of widths) {
      const name = `${hash}-${width}.webp`;
      const result = await sharp(rotated)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 6 })
        .toBuffer({ resolveWithObject: true });
      await writeFile(path.join(output, name), result.data);
      variants.push({
        width: result.info.width,
        height: result.info.height,
        src: `/hero-optimized/${name}`,
        bytes: result.data.length,
      });
    }
    manifest[canonicalUrl(sourceUrl)] = {
      updatedAt: image.updated_at ?? image.updatedAt ?? '',
      originalBytes: buffer.length,
      variants,
    };
    console.log(
      `Slide ${image.id}: original ${Math.round(buffer.length / 1024)} KB; ` +
        variants.map((v) => `${v.width}px ${Math.round(v.bytes / 1024)} KB`).join(', '),
    );
  }

  // Publish the mapping only after ALL downloads and conversions succeed.
  // Existing hashed files are retained so already-open pages keep working.
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
  console.log(
    `Prepared ${Object.keys(manifest).length} slides. Build and deploy the frontend to publish them.`,
  );
} catch (error) {
  console.error(`Hero optimization failed: ${error.message}. Existing manifest preserved.`);
  process.exitCode = 1;
}
