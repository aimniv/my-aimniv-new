// Client side of the server-stored site content (see api/admin/[action].ts).
// Visitors read /api/admin/content; the admin saves it, and images pasted as
// data URLs are compressed and uploaded to storage so only links get stored.

export interface SiteContent {
  profile?: any;
  academics?: any;
  certificates?: any[];
  skills?: any;
  contact?: any;
  announcements?: any[];
  courses?: any[];
  projects?: any[];
  blogs?: any[];
  socialPosts?: any[];
}

const CONTENT_URL = '/api/admin/content';
const UPLOAD_URL = '/api/admin/upload';
const MAX_IMAGE_SIDE = 1600;
const SKIP_COMPRESS_BELOW = 200 * 1024;
const UPLOADABLE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const fetchServerContent = async (): Promise<SiteContent | null> => {
  try {
    const res = await fetch(CONTENT_URL, { credentials: 'same-origin' });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data.content === 'object' ? data.content : null;
  } catch {
    return null;
  }
};

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality: number) =>
  new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));

const prepareImage = async (dataUrl: string): Promise<Blob> => {
  const original = await (await fetch(dataUrl)).blob();
  if (!UPLOADABLE.includes(original.type)) {
    throw new Error('Desteklenmeyen resim türü (JPG, PNG, WebP veya GIF kullanın).');
  }
  // Animated GIFs and already small files are uploaded untouched.
  if (original.type === 'image/gif' || original.size < SKIP_COMPRESS_BELOW) return original;

  const bitmap = await createImageBitmap(original);
  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  let blob = await canvasToBlob(canvas, 'image/webp', 0.85);
  if (!blob || blob.type !== 'image/webp') blob = await canvasToBlob(canvas, 'image/jpeg', 0.85);
  // Never make a file bigger by recompressing it.
  return blob && blob.size < original.size ? blob : original;
};

const uploadImage = async (dataUrl: string): Promise<string> => {
  const blob = await prepareImage(dataUrl);
  const res = await fetch(UPLOAD_URL, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': blob.type },
    body: blob,
  });
  if (res.status === 401) throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
  if (res.status === 503) throw new Error('Resim depolaması (Vercel Blob) yapılandırılmamış.');
  if (!res.ok) throw new Error('Resim yüklenemedi.');
  return (await res.json()).url;
};

const DATA_URL = /^data:image\//;

// Replaces every embedded data-URL image anywhere in the value with an uploaded link.
const externalizeImages = async <T>(value: T, cache: Map<string, string>): Promise<T> => {
  if (typeof value === 'string') {
    if (!DATA_URL.test(value)) return value;
    if (!cache.has(value)) cache.set(value, await uploadImage(value));
    return cache.get(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    const out: any[] = [];
    for (const item of value) out.push(await externalizeImages(item, cache));
    return out as unknown as T;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const [key, item] of Object.entries(value)) out[key] = await externalizeImages(item, cache);
    return out as T;
  }
  return value;
};

export const containsDataImages = (value: unknown): boolean => JSON.stringify(value).includes('"data:image/');

// Saves the content on the server. Returns the content as stored (image links instead of
// data URLs) and whether any images were uploaded. Throws an Error with a readable message.
export const saveServerContent = async (
  content: SiteContent
): Promise<{ content: SiteContent; imagesUploaded: boolean }> => {
  const imagesUploaded = containsDataImages(content);
  const prepared = imagesUploaded ? await externalizeImages(content, new Map()) : content;

  let res: Response;
  try {
    res = await fetch(CONTENT_URL, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prepared),
    });
  } catch {
    throw new Error('Sunucuya ulaşılamadı.');
  }
  if (res.status === 401) throw new Error('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.');
  if (res.status === 413) throw new Error('İçerik çok büyük.');
  if (res.status === 503) throw new Error('Sunucu depolaması (Vercel Blob) yapılandırılmamış.');
  if (!res.ok) throw new Error('Kaydedilemedi.');
  return { content: prepared, imagesUploaded };
};
