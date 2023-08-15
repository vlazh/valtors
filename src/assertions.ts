import isEmptyObject from '@js-toolkit/utils/isEmptyObject';
import type { TargetValueAssertion, ValueAssertion } from './validators';

/** Returns false for null, undefined, NaN, infinity numbers, empty objects, empty arrays, empty strings. */
export function required(): ValueAssertion {
  return (value) => {
    if (value == null) {
      return false;
    }

    switch (typeof value) {
      case 'string':
        return value.length > 0;
      case 'number':
        return Number.isFinite(value);
      case 'object':
        return Array.isArray(value) ? !!value.length : !isEmptyObject(value);
      default:
        return true;
    }
  };
}

/**/

export function min(minValue: number): ValueAssertion<unknown> {
  return (value) => value == null || (typeof value === 'number' && value >= minValue);
}

export function max(maxValue: number): ValueAssertion<unknown> {
  return (value) => value == null || (typeof value === 'number' && value <= maxValue);
}

/**/

export function minLength(minValue: number): ValueAssertion<unknown> {
  return (value) =>
    value == null ||
    ((typeof value === 'string' || Array.isArray(value)) && value.length >= minValue);
}

export function maxLength(maxValue: number): ValueAssertion<unknown> {
  return (value) =>
    value == null ||
    ((typeof value === 'string' || Array.isArray(value)) && value.length <= +maxValue);
}

export function match(regExp: RegExp): ValueAssertion<unknown> {
  return (value) => value == null || (typeof value === 'string' && regExp.test(value));
}

/**/

export function equals<T extends AnyObject>(otherProp: keyof T): TargetValueAssertion<T> {
  return (value, target) => otherProp in target && value === target[otherProp];
}

export function oneOf(...list: unknown[]): ValueAssertion<unknown> {
  return (value) => value == null || list.indexOf(value) >= 0;
}

export function email(): ValueAssertion<unknown> {
  return match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
}

/** Validates string via Date.parse */
export function dateString(): ValueAssertion<unknown> {
  return (value) =>
    value == null || (typeof value === 'string' && Number.isFinite(Date.parse(value)));
}
