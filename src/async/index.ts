import { validate as validateSync } from '../validate';

export * from '../index';

export function validate<T extends object>(
  target: T,
  propName?: keyof T
): Promise<ReturnType<typeof validateSync>> {
  return new Promise((resolve) => {
    resolve(validateSync(target, propName));
  });
}
