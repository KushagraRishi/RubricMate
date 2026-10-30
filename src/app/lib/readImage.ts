/**
 * Turns a picked file into something an <img> can actually show.
 *
 * Three things happen here, and all three matter. HEIC is converted, because
 * it is what an iPhone saves by default and no browser except Safari can
 * decode it; dropping one in previously left a broken image icon in the page.
 * Everything is then decoded before it is inserted, so a file that cannot be
 * read fails with a sentence rather than silently. And anything large is
 * scaled down, because a photo straight off a phone is several thousand pixels
 * wide and would be carried, base64 encoded, in the page, the Word export and
 * the print preview.
 */

const HEIC = /\.(heic|heif)$/i;
const MAX_EDGE = 1600;
const MAX_BYTES = 25 * 1024 * 1024;

export class ImageProblem extends Error {}

export function isHeic(file: File): boolean {
  return HEIC.test(file.name) || /hei[cf]/i.test(file.type);
}

export async function readImageFile(file: File): Promise<string> {
  if (file.size > MAX_BYTES) {
    throw new ImageProblem('That image is over 25MB. Try a smaller one.');
  }

  const source = isHeic(file) ? await fromHeic(file) : file;
  const decoded = await decode(source);
  try {
    return render(decoded, source.type);
  } finally {
    decoded.release();
  }
}

interface Decoded {
  source: CanvasImageSource;
  width: number;
  height: number;
  release: () => void;
}

/**
 * The decoder is 1.3MB, so it is fetched only when someone actually picks a
 * HEIC. Everyone else never downloads it.
 */
async function fromHeic(file: File): Promise<Blob> {
  let converted: Blob | Blob[];
  try {
    const { default: heic2any } = await import('heic2any');
    converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
  } catch {
    throw new ImageProblem(
      'Could not read that HEIC photo. Save it as JPEG on your phone and try again.',
    );
  }
  // A live photo arrives as several frames. The first one is the picture.
  return Array.isArray(converted) ? converted[0] : converted;
}

async function decode(blob: Blob): Promise<Decoded> {
  try {
    const bitmap = await createImageBitmap(blob);
    return {
      source: bitmap,
      width: bitmap.width,
      height: bitmap.height,
      release: () => bitmap.close(),
    };
  } catch {
    // createImageBitmap turns down formats an <img> is perfectly happy with,
    // SVG among them, so the element gets a try before anyone gives up.
    return fromElement(blob);
  }
}

function fromElement(blob: Blob): Promise<Decoded> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.onload = () => resolve({
      source: image,
      // An SVG with no width of its own reports nothing. Pick a size rather
      // than draw a canvas zero pixels wide.
      width: image.naturalWidth || 512,
      height: image.naturalHeight || 512,
      release: () => URL.revokeObjectURL(url),
    });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new ImageProblem('That file is not an image this browser can open.'));
    };
    image.src = url;
  });
}

function render(image: Decoded, type: string): string {
  const scale = Math.min(1, MAX_EDGE / Math.max(image.width, image.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));

  const context = canvas.getContext('2d');
  if (!context) throw new ImageProblem('Could not read that image.');
  context.drawImage(image.source, 0, 0, canvas.width, canvas.height);

  // PNG only where the source could have had transparency. A photo saved as
  // PNG is several times the size for no gain, and it travels into the Word
  // file as well.
  const keepsAlpha = /png|gif|webp|svg/i.test(type);
  return canvas.toDataURL(keepsAlpha ? 'image/png' : 'image/jpeg', 0.85);
}
