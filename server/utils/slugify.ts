export const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")           
    .replace(/[^\w\-]+/g, "")          
    .replace(/\-\-+/g, "-")            
    .replace(/^-+/, "")                
    .replace(/-+$/, "");               
};

export const generateUniqueSlug = (
  input: string,
  existingSlugs: string[] = []
): string => {
  const baseSlug = slugify(input);
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  return uniqueSlug;
};
