import { isEmptyObject } from './utils';

type SimpleValidator = (value: unknown) => boolean;
type ComplexValidator<T extends object> =
  | ((value: unknown, target: T) => boolean)
  | ((value: unknown, target: T, prop: keyof T) => boolean);
export type Validator<T extends object = {}> = SimpleValidator | ComplexValidator<T>;

/**
 * Returns false for null, undefined, NaN, infinity numbers, empty objects, empty arrays, empty strings.
 */
export function requiredValidator(): Validator {
  return (value: unknown) => {
    if (value == null) {
      return false;
    }

    switch (typeof value) {
      case 'string':
        return value.length > 0;
      case 'number':
        return Number.isFinite(value);
      case 'object':
        return Array.isArray(value) ? !!value.length : !isEmptyObject(value as object);
      default:
        return true;
    }
  };
}

/**/

export function minValidator(min: number): Validator {
  return (value: unknown) => value == null || (typeof value === 'number' && value >= min);
}

export function maxValidator(max: number): Validator {
  return (value: unknown) => value == null || (typeof value === 'number' && value <= max);
}

/**/

export function minLengthValidator(min: number): Validator {
  return (value: unknown) =>
    value == null || ((typeof value === 'string' || Array.isArray(value)) && value.length >= min);
}

export function maxLengthValidator(max: number): Validator {
  return (value: unknown) =>
    value == null || ((typeof value === 'string' || Array.isArray(value)) && value.length <= +max);
}

export function matchValidator(regExp: RegExp): Validator {
  return (value: unknown) => value == null || (typeof value === 'string' && regExp.test(value));
}

/**/

export function equalsValidator<T extends object>(otherProp: keyof T): Validator<T> {
  return (value: unknown, target: T) => otherProp in target && value === target[otherProp];
}

export function enumValidator(...enums: unknown[]): Validator {
  return (value: unknown) => value == null || enums.indexOf(value) >= 0;
}

export function emailValidator(): Validator {
  return matchValidator(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

/** Validates string via Date.parse */
export function dateStringValidator(): Validator {
  return (value: unknown) =>
    value == null || (typeof value === 'string' && Number.isFinite(Date.parse(value)));
}
