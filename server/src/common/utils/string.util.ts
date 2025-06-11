export const slugify = (str: string) => {
  if (!str) return '';
  if (str.length > 1000) str = str.slice(0, 1000);

  return str
    .toString()
    .toLowerCase()
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/[^\w-]/g, '') // Remove non-word characters except hyphens
    .split('-') // Split into parts by hyphens
    .filter((part) => part !== '') // Remove empty parts (from consecutive hyphens)
    .join('-');
};
