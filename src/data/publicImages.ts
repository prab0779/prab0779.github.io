const imageFiles = import.meta.glob('/public/**/*.{png,jpg,jpeg,gif,webp}', { eager: false });

const excluded = new Set(['bg.png', 'logo.png', 'logo.aotr.png', 'logo.aotr11.png', 'discord-icon.png', 'customdiscordlogo.png', 'customsrverlogo.png', 'missing.png']);

export const publicImages: string[] = Object.keys(imageFiles)
  .map((path) => path.replace('/public/', ''))
  .filter((name) => !excluded.has(name))
  .sort();
