/* eslint-disable import/prefer-default-export */

export function isEmptyObject(obj: {}): boolean {
  // eslint-disable-next-line guard-for-in, no-restricted-syntax
  for (const _ in obj) {
    return false;
  }
  return true;
}
