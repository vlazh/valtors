export function isEmptyObject(obj: any) {
  // tslint:disable-next-line:forin
  for (const _ in obj) {
    return false;
  }
  return true;
}
