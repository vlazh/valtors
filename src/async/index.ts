import { validate as validateSync } from '../validate';

export * from '../index';

export function validate<T extends object>(
  target: T,
  propName?: keyof T | undefined
): Promise<ReturnType<typeof validateSync>> {
  return new Promise((resolve) => {
    resolve(validateSync(target, propName));
  });
}
