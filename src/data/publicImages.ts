import allFiles from 'virtual:public-images';

const excluded = new Set(['bg.png', 'logo.png', 'logo.aotr.png', 'logo.aotr11.png', 'discord-icon.png', 'customdiscordlogo.png', 'customsrverlogo.png', 'missing.png']);

export const publicImages: string[] = (allFiles as string[])
  .filter((name) => !excluded.has(name))
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
