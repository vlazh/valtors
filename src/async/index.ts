import * as sync from '../validation';

const { validate: validateSync /* , ...exporting */ } = sync;

export function validate(target: any, propName?: string) {
  return new Promise(resolve => resolve(validateSync(target, propName)));
}
// Use commonjs modules for export all form sync but not validate from sync.
// Object.assign(exports, { validate, ...exporting });
