export function isEmptyObject(obj) {
  for (const p in obj) {
    return false;
  }
  return true;
}
