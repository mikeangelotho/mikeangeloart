import assert from "node:assert/strict";
import test from "node:test";
import {
  getMediaKind,
  getProjectVideos,
  getVideoMimeType,
  getVideoPoster,
  getVimeoEmbedUrl,
  isVideoUrl,
} from "../src/utils/media.ts";
import { createImageSources, getImageFormat, getWebPUrl } from "../src/utils/image.ts";

test("uses verified CDN image variants without inventing logo or external sources", () => {
  const published = "https://cdn.mikeangelo.art/project/keypoint-media/layout.PNG?version=2";
  assert.equal(createImageSources(published).webp.srcset, "https://cdn.mikeangelo.art/project/keypoint-media/layout.webp?version=2");
  assert.equal(createImageSources("https://cdn.mikeangelo.art/project/keypoint-media/client-logo.png").webp, undefined);
  assert.equal(createImageSources("https://third-party.example.com/layout.png").webp, undefined);
  assert.equal(createImageSources("/local-image.jpg").webp, undefined);
  assert.equal(getImageFormat("https://example.com/photo.jpg?signature=123"), "jpg");
  assert.equal(getWebPUrl("https://example.com/photo.jpg?signature=123"), "https://example.com/photo.webp?signature=123");
});

test("classifies media by URL path, including signed URLs and case variations", () => {
  assert.equal(getMediaKind("https://cdn.example.com/film.MP4?signature=123#preview"), "video");
  assert.equal(getMediaKind("https://cdn.example.com/stream.m3u8?token=abc"), "hls");
  assert.equal(getVideoMimeType("https://cdn.example.com/stream.M3U8?token=abc"), "application/x-mpegURL");
  assert.equal(getMediaKind("https://example.com/mp4-poster.jpg"), "image");
  assert.equal(getMediaKind("https://example.com/image.png?redirect=vimeo.com"), "image");
  assert.equal(getMediaKind("https://player.vimeo.com/video/123456"), "vimeo");
  assert.equal(isVideoUrl(undefined), false);
});

test("builds a Gumlet poster without double slashes or changing the source object", () => {
  const video = Object.freeze({
    url: "https://video.gumlet.io/collection/asset/main.m3u8?token=123",
    thumbnail: "",
  });
  assert.equal(getVideoPoster(video), "https://video.gumlet.io/collection/asset/thumbnail-1-0.png");
  assert.equal(video.thumbnail, "");
  assert.equal(getVideoPoster({ ...video, thumbnail: "https://example.com/poster.jpg" }), "https://example.com/poster.jpg");
  assert.equal(getVideoPoster({ url: "https://cdn.example.com/film.mp4", thumbnail: "" }), undefined);
});

test("converts Vimeo links while retaining unlisted access and existing embed URLs", () => {
  assert.equal(getVimeoEmbedUrl("https://vimeo.com/123456/privatehash?autoplay=0"), "https://player.vimeo.com/video/123456?autoplay=0&h=privatehash");
  const embedded = "https://player.vimeo.com/video/123456?h=privatehash";
  assert.equal(getVimeoEmbedUrl(embedded), embedded);
});

test("restores a primary film when the gallery is empty and deduplicates by URL", () => {
  const primary = Object.freeze({ url: "https://cdn.example.com/primary.mp4", title: "Primary" });
  const duplicate = Object.freeze({ ...primary, title: "Conflicting gallery caption" });
  const secondary = Object.freeze({ url: "https://cdn.example.com/secondary.m3u8", title: "Secondary" });
  assert.deepEqual(getProjectVideos({ mainKeypointMedia: primary, projectVideos: [] }), [primary]);
  assert.deepEqual(getProjectVideos({ mainKeypointMedia: primary, projectVideos: [duplicate, secondary] }), [primary, secondary]);
  assert.equal(duplicate.title, "Conflicting gallery caption");
  assert.deepEqual(getProjectVideos({ mainKeypointMedia: { url: "https://cdn.example.com/image.png" }, projectVideos: [] }), []);
});
