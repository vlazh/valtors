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
 * Validates all properties of object `target` or just property `propName`.
 * If `testValue` is provided then it used in validation instead of `target[propName]`
 */
export default function validate<T extends object, K extends keyof T>(
  target: T,
  propName?: K,
  testValue?: T[K]
): ValidationErrors<T> {
  return (propName ? [propName] : (Object.getOwnPropertyNames(target) as (keyof T)[])).reduce<
    ValidationErrors<T>
  >((acc, prop) => {
    const validators: Validators<T> = target[getPropValidatorsName()] || {};
    const propValidators = validators[prop];

    if (propValidators) {
      const isTest = propName && arguments.length >= 3;
      const propValue = isTest ? testValue : target[prop];

      const notValid = propValidators
        .sort(orderCompare)
        .find(v => !v.validator(propValue, target, prop));

      acc[prop] = notValid
        ? {
            error: notValid.message
              .replace(/{PROP}/, prop.toString())
              .replace(/{VALUE}/, String(propValue)),
            type: notValid.type,
          }
        : {};
    }
    return acc;
  }, {});
}
