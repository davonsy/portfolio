const categoryAliases = {
  graphic: 'graphic',
  'graphic-design': 'graphic',
  design: 'graphic',
  motion: 'motion',
  'motion-graphic': 'motion',
  'motion-graphics': 'motion',
  '3d': 'three',
  three: 'three',
  vfx: 'three',
  '3d-vfx': 'three',
  '3d & vfx': 'three',
  film: 'film',
  photography: 'film',
  'film-photography': 'film',
  'film & photography': 'film',
};

const infoModules = import.meta.glob('../public/projects/*/info.json', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const assetModules = import.meta.glob('../public/projects/**/*.{jpg,jpeg,png,webp,gif,heic,HEIC,mp4,webm,mov}', {
  eager: true,
  query: '?url',
  import: 'default',
});

function normalizeCategory(category = '') {
  const key = String(category).trim().toLowerCase();
  return categoryAliases[key] || key || 'graphic';
}

function normalizeCategories(info = {}) {
  const rawCategories = [
    ...(Array.isArray(info.categories) ? info.categories : []),
    ...(Array.isArray(info.categoryTags) ? info.categoryTags : []),
    ...(Array.isArray(info.tags) ? info.tags : []),
    ...(info.category ? [info.category] : []),
  ];
  const normalized = rawCategories
    .map((category) => normalizeCategory(category))
    .filter(Boolean);
  return Array.from(new Set(normalized.length ? normalized : ['graphic']));
}

function humanize(value = '') {
  return String(value)
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function getSlugFromInfoPath(path) {
  return path.match(/public\/projects\/([^/]+)\/info\.json$/)?.[1];
}

function publicProjectAsset(slug, filename) {
  if (!filename) return '';
  if (/^(https?:)?\/\//.test(filename) || filename.startsWith('/')) return filename;
  return `/projects/${slug}/${filename}`;
}

function getProjectAssetEntries(slug, type) {
  const prefix = `../public/projects/${slug}/`;
  return Object.entries(assetModules)
    .filter(([path]) => path.startsWith(prefix))
    .filter(([path]) => {
      const extension = path.split('.').pop()?.toLowerCase();
      if (type === 'video') return ['mp4', 'webm', 'mov'].includes(extension);
      return ['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'].includes(extension);
    })
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([path, url]) => ({
      path,
      file: path.replace(prefix, ''),
      url,
    }));
}

function isRandomValue(value = '') {
  return String(value).trim().toLowerCase() === 'random';
}

function pickRandomAsset(assets) {
  if (!assets.length) return '';
  return assets[Math.floor(Math.random() * assets.length)]?.file || '';
}

function getSortableYear(project) {
  const year = Number.parseInt(project?.year, 10);
  return Number.isFinite(year) ? year : 0;
}

export function compareProjectsByYearAndTitle(projectA, projectB) {
  const yearDifference = getSortableYear(projectB) - getSortableYear(projectA);
  if (yearDifference !== 0) return yearDifference;

  return String(projectA?.title || '').localeCompare(String(projectB?.title || ''), undefined, {
    sensitivity: 'base',
    numeric: true,
  });
}

function parseProjectInfo(path, rawInfo) {
  const slug = getSlugFromInfoPath(path);
  if (!slug) return null;

  let info = {};
  try {
    info = JSON.parse(rawInfo);
  } catch (error) {
    console.warn(`Could not parse ${path}`, error);
    return null;
  }

  const imageAssets = getProjectAssetEntries(slug, 'image');
  const videoAssets = getProjectAssetEntries(slug, 'video');
  const categories = normalizeCategories(info);
  const category = categories[0];
  const title = info.title || humanize(slug);
  const thumbnail = isRandomValue(info.thumbnail)
    ? pickRandomAsset(imageAssets)
    : info.thumbnail || imageAssets.find((asset) => asset.file.toLowerCase() === 'thumbnail.jpg')?.file || imageAssets[0]?.file || 'thumbnail.jpg';
  const hero = info.hero || info.heroVideo || videoAssets.find((asset) => asset.file.toLowerCase() === 'hero.mp4')?.file || '';
  const previewVideo =
    isRandomValue(info.previewVideo) || isRandomValue(info.preview)
      ? pickRandomAsset(videoAssets)
      : info.previewVideo ||
        info.videoThumbnail ||
        info.thumbnailVideo ||
        info.preview ||
        hero ||
        videoAssets[0]?.file ||
        '';
  const images = Array.isArray(info.images)
    ? info.images.map((image) => publicProjectAsset(slug, image))
    : imageAssets
        .filter((asset) => !['thumbnail.jpg', 'thumbnail.jpeg'].includes(asset.file.toLowerCase()))
        .map((asset) => asset.url);
  const reservedVideoFiles = new Set([thumbnail, hero, previewVideo, 'hero.mp4'].filter(Boolean).map((file) => String(file).toLowerCase()));
  const videos = Array.isArray(info.videos)
    ? info.videos.map((video) => publicProjectAsset(slug, video))
    : videoAssets.filter((asset) => !reservedVideoFiles.has(asset.file.toLowerCase())).map((asset) => asset.url);

  return {
    slug,
    title,
    category,
    categories,
    categoryLabel: info.categoryLabel || categories.map((item) => humanize(item)).join(' / '),
    categoryLabels: categories.map((item) => humanize(item)),
    year: info.year || '',
    role: info.role || '',
    description: info.description || '',
    client: info.client || '',
    path: `/projects/${slug}`,
    image: publicProjectAsset(slug, thumbnail),
    thumbnail: publicProjectAsset(slug, thumbnail),
    hero: publicProjectAsset(slug, hero),
    previewVideo: publicProjectAsset(slug, previewVideo),
    images,
    videos,
    order: Number.isFinite(Number(info.order)) ? Number(info.order) : 999,
    featured: Boolean(info.featured),
  };
}

export const folderProjects = Object.entries(infoModules)
  .map(([path, rawInfo]) => parseProjectInfo(path, rawInfo))
  .filter(Boolean)
  .sort(compareProjectsByYearAndTitle);

export const hasFolderProjects = folderProjects.length > 0;
