import { validate as validateSync, type ValidateOptions } from '../validate';

export * from '../index';

export function validate<T extends AnyObject, K extends keyof T>(
  target: T,
  propName?: K | undefined,
  options: ValidateOptions<T, K> = {}
): Promise<ReturnType<typeof validateSync>> {
  return new Promise((resolve) => {
    resolve(validateSync(target, propName, options));
  });
}
