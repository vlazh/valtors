/* eslint-disable import/prefer-default-export */
import { validate as validateSync } from '../validation';

export function validate(
  target: object,
  propName?: PropertyKey
): Promise<ReturnType<typeof validateSync>> {
  return new Promise(resolve => resolve(validateSync(target, propName)));
}
