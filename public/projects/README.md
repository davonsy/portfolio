Add one folder per portfolio project.

Required files:

- info.json
- thumbnail.jpg

Optional files:

- hero.mp4
- image-01.jpg
- image-02.jpg
- any additional .jpg, .jpeg, .png, .webp, .gif, .mp4, or .webm files

Example:

```json
{
  "title": "PROJECT TITLE",
  "categories": ["graphic-design", "motion-graphic"],
  "year": "2026",
  "role": "ART DIRECTION / DESIGN",
  "description": "Short project description.",
  "featured": true,
  "order": 1
}
```

Supported category values:

- graphic-design
- motion-graphic
- 3d-vfx
- film-photography

Use the "categories" array to place one project in multiple sections. The older "category" field still works for single-category projects.

The site automatically uses thumbnail.jpg, hero.mp4, and any image/video files in the folder. You can also override assets in info.json with "thumbnail", "hero", "previewVideo", "images", or "videos".
