import {
  ValidableProperty,
  getPropValidatorsName,
  Validators,
  ValidatorType,
} from './validatorsDecorators';

export type ValidationResult =
  | {
      error: string;
      type: ValidatorType;
    }
  | {
      error?: never;
      type?: never;
    };

export type ValidationErrors<T extends object> = { [P in keyof T]?: ValidationResult };

function orderCompare<T extends object>(a: ValidableProperty<T>, b: ValidableProperty<T>): number {
  return (
    (a.order ? a.order : Number.MAX_SAFE_INTEGER) - (b.order ? b.order : Number.MAX_SAFE_INTEGER)
  );
}

/**
 * Validates all properties of object @param target or just property @param propName
 */
export default function validate<T extends object>(
  target: T,
  propName?: keyof T
): ValidationErrors<T> {
  return (propName ? [propName] : (Object.getOwnPropertyNames(target) as (keyof T)[])).reduce<
    ValidationErrors<T>
  >((acc, prop) => {
    const validators: Validators<T> = target[getPropValidatorsName()] || {};
    const propValidators = validators[prop];

    if (propValidators) {
      const notValid = propValidators
        .sort(orderCompare)
        .find(v => !v.validator(target[prop], target, prop));

      acc[prop] = notValid
        ? {
            error: notValid.message
              .replace(/{PROP}/, prop.toString())
              .replace(/{VALUE}/, String(target[prop])),
            type: notValid.type,
          }
        : {};
    }
    return acc;
  }, {});
}
