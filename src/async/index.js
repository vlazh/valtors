import * as sync from '../validation';


const { validate: validateSync, ...exporting } = sync;

function validate(target, propName = null) {
  return new Promise(resolve => resolve(validateSync(target, propName)));
}


export { validate };
// Use commonjs modules for export all form sync but not validate from sync.
// Object.assign(exports, { validate, ...exporting });
