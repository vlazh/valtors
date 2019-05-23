/* eslint-disable import/prefer-default-export */
import validateSync from '../validate';

export function validate<T extends object>(
  target: T,
  propName?: keyof T
): Promise<ReturnType<typeof validateSync>> {
  return new Promise(resolve => resolve(validateSync(target, propName)));
}
