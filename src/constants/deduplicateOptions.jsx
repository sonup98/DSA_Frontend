export const deduplicateOptions = (arr) => {
  const seen = new Set();
  return arr.filter((item) => {
    const val = item?.value?.toLowerCase().trim();
    if (seen.has(val)) return false;
    seen.add(val);
    return true;
  });
};
