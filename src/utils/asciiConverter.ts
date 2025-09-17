export interface ASCIIConfig {
  sparsity: number; // 1-10, higher = more sparse
  characters: string;
  fontSize: number;
}

const DEFAULT_ASCII_CHARS = '@%#*+=-:. ';

export const defaultConfig: ASCIIConfig = {
  sparsity: 4,
  characters: DEFAULT_ASCII_CHARS,
  fontSize: 8,
};

export const loadImageToCanvas = (
  imageSrc: string,
  canvas: HTMLCanvasElement
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      resolve();
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = imageSrc;
  });
};

export const getPixelBrightness = (r: number, g: number, b: number): number => {
  // Calculate luminance using standard formula
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

export const brightnessToChar = (brightness: number, characters: string): string => {
  const index = Math.floor((brightness / 255) * (characters.length - 1));
  return characters[characters.length - 1 - index]; // Invert for dark backgrounds
};

export const convertImageToASCII = (
  canvas: HTMLCanvasElement,
  config: ASCIIConfig
): string[][] => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const { width, height } = canvas;
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;

  const result: string[][] = [];
  const step = config.sparsity;

  for (let y = 0; y < height; y += step) {
    const row: string[] = [];
    for (let x = 0; x < width; x += step) {
      const pixelIndex = (y * width + x) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      const brightness = getPixelBrightness(r, g, b);
      const char = brightnessToChar(brightness, config.characters);
      row.push(char);
    }
    result.push(row);
  }

  return result;
};

export const loadVideoToCanvas = (
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement
): void => {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
};