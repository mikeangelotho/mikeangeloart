import { describe, it, expect } from 'vitest';
import { 
  getImageBasePath, 
  getWebPUrl, 
  isWebPUrl, 
  isConvertibleToWebP,
  createImageSources,
  getImageFormat,
  shouldUseWebP
} from '../src/utils/image';

describe('Image Utils', () => {
  describe('getImageBasePath', () => {
    it('should remove JPEG extension', () => {
      expect(getImageBasePath('https://example.com/image.jpg')).toBe('https://example.com/image');
      expect(getImageBasePath('https://example.com/image.jpeg')).toBe('https://example.com/image');
    });

    it('should remove PNG extension', () => {
      expect(getImageBasePath('https://example.com/image.png')).toBe('https://example.com/image');
    });

    it('should handle WebP extension', () => {
      expect(getImageBasePath('https://example.com/image.webp')).toBe('https://example.com/image');
    });

    it('should handle complex URLs', () => {
      expect(getImageBasePath('https://cdn.mikeangelo.art/project/image.jpg')).toBe('https://cdn.mikeangelo.art/project/image');
    });
  });

  describe('isWebPUrl', () => {
    it('should detect WebP URLs', () => {
      expect(isWebPUrl('https://example.com/image.webp')).toBe(true);
      expect(isWebPUrl('https://example.com/image.WEBP')).toBe(true);
    });

    it('should reject non-WebP URLs', () => {
      expect(isWebPUrl('https://example.com/image.jpg')).toBe(false);
      expect(isWebPUrl('https://example.com/image.png')).toBe(false);
    });
  });

  describe('isConvertibleToWebP', () => {
    it('should detect convertible formats', () => {
      expect(isConvertibleToWebP('https://example.com/image.jpg')).toBe(true);
      expect(isConvertibleToWebP('https://example.com/image.jpeg')).toBe(true);
      expect(isConvertibleToWebP('https://example.com/image.png')).toBe(true);
      expect(isConvertibleToWebP('https://example.com/image.gif')).toBe(true);
    });

    it('should reject non-convertible formats', () => {
      expect(isConvertibleToWebP('https://example.com/image.webp')).toBe(false);
      expect(isConvertibleToWebP('https://example.com/image.svg')).toBe(false);
    });
  });

  describe('getWebPUrl', () => {
    it('should generate WebP URL from JPEG', () => {
      expect(getWebPUrl('https://example.com/image.jpg')).toBe('https://example.com/image.webp');
    });

    it('should return null for non-convertible formats', () => {
      expect(getWebPUrl('https://example.com/image.webp')).toBe('https://example.com/image.webp');
      expect(getWebPUrl('https://example.com/image.svg')).toBe(null);
    });

    it('should handle complex URLs', () => {
      const complexUrl = 'https://cdn.mikeangelo.art/bahlsen-drone-drop-pop-up/Bahlsen%2BBlu.jpg';
      expect(getWebPUrl(complexUrl)).toBe('https://cdn.mikeangelo.art/bahlsen-drone-drop-pop-up/Bahlsen%2BBlu.webp');
    });
  });

  describe('createImageSources', () => {
    it('should create sources for JPEG', () => {
      const sources = createImageSources('https://example.com/image.jpg');
      expect(sources.webp).toEqual({
        srcset: 'https://example.com/image.webp',
        type: 'image/webp'
      });
      expect(sources.fallback).toEqual({
        srcset: 'https://example.com/image.jpg',
        type: 'image/jpeg'
      });
    });

    it('should handle WebP URLs correctly', () => {
      const sources = createImageSources('https://example.com/image.webp');
      expect(sources.webp).toBeUndefined();
      expect(sources.fallback).toEqual({
        srcset: 'https://example.com/image.webp',
        type: 'image/webp'
      });
    });
  });

  describe('shouldUseWebP', () => {
    it('should return true for convertible non-WebP images', () => {
      expect(shouldUseWebP('https://example.com/image.jpg')).toBe(true);
      expect(shouldUseWebP('https://example.com/image.png')).toBe(true);
    });

    it('should return false for WebP images', () => {
      expect(shouldUseWebP('https://example.com/image.webp')).toBe(false);
    });

    it('should return false for non-convertible formats', () => {
      expect(shouldUseWebP('https://example.com/image.svg')).toBe(false);
    });
  });
});