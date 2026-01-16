export enum ImageFormat {
  JPEG = 'jpeg',
  JPG = 'jpg',
  PNG = 'png',
  WEBP = 'webp',
  GIF = 'gif',
  AVIF = 'avif'
}

export interface ImageSource {
  srcset: string;
  type: string;
}

export interface ImageSources {
  webp?: ImageSource;
  fallback: ImageSource;
}

/**
 * Extract the base path from an image URL by removing the file extension
 */
export function getImageBasePath(imageUrl: string): string {
  const supportedExtensions = Object.values(ImageFormat);
  const extensionRegex = new RegExp(`\\.(${supportedExtensions.join('|')})$`, 'i');
  
  return imageUrl.replace(extensionRegex, '');
}

/**
 * Check if the URL already has a WebP extension
 */
export function isWebPUrl(imageUrl: string): boolean {
  return imageUrl.toLowerCase().endsWith('.webp');
}

/**
 * Check if the URL is an image format that can be converted to WebP
 */
export function isConvertibleToWebP(imageUrl: string): boolean {
  const convertibleFormats = [ImageFormat.JPEG, ImageFormat.JPG, ImageFormat.PNG, ImageFormat.GIF];
  const extensionRegex = new RegExp(`\\.(${convertibleFormats.join('|')})$`, 'i');
  
  return extensionRegex.test(imageUrl);
}

/**
 * Generate WebP URL from any image URL
 */
export function getWebPUrl(imageUrl: string): string | null {
  if (isWebPUrl(imageUrl)) {
    return imageUrl;
  }
  
  if (!isConvertibleToWebP(imageUrl)) {
    return null;
  }
  
  const basePath = getImageBasePath(imageUrl);
  return `${basePath}.webp`;
}

/**
 * Get the MIME type for an image format
 */
export function getImageMimeType(format: ImageFormat): string {
  const mimeTypes: Record<ImageFormat, string> = {
    [ImageFormat.JPEG]: 'image/jpeg',
    [ImageFormat.JPG]: 'image/jpeg',
    [ImageFormat.PNG]: 'image/png',
    [ImageFormat.WEBP]: 'image/webp',
    [ImageFormat.GIF]: 'image/gif',
    [ImageFormat.AVIF]: 'image/avif'
  };
  
  return mimeTypes[format] || 'image/jpeg';
}

/**
 * Extract the current format from an image URL
 */
export function getImageFormat(imageUrl: string): ImageFormat | null {
  const extensionMatch = imageUrl.match(/\.(\w+)$/i);
  if (!extensionMatch) return null;
  
  const extension = extensionMatch[1].toLowerCase();
  return Object.values(ImageFormat).find(format => format === extension) || null;
}

/**
 * Create picture element sources with WebP fallback
 */
export function createImageSources(imageUrl: string): ImageSources {
  const format = getImageFormat(imageUrl);
  const mimeType = format ? getImageMimeType(format) : 'image/jpeg';
  
  const webpUrl = getWebPUrl(imageUrl);
  
  return {
    webp: webpUrl ? { srcset: webpUrl, type: 'image/webp' } : undefined,
    fallback: { srcset: imageUrl, type: mimeType }
  };
}

/**
 * Determine if WebP should be used based on image URL
 */
export function shouldUseWebP(imageUrl: string): boolean {
  return isConvertibleToWebP(imageUrl) && !isWebPUrl(imageUrl);
}