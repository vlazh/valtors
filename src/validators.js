import { isEmptyObject } from './utils';


export function requiredValidator() {
  return (value) => {
    if (value == null) {
      return false;
    }

    switch (typeof value) {
      case 'string':
        return value.length > 0;
      case 'number':
        return isFinite(value);
      case 'object':
        return Array.isArray(value) ? !!value.length : !isEmptyObject(value);
      default:
        return true;
    }
  };
}

export function getTypeName(type) {
  const typeName = (typeof type === 'function' && type.name.toLowerCase()) ||
      (typeof type === 'string' && type);
  if (!typeName) { throw new Error(`Wrong type '${type}.'`); }
  return typeName;
}

export function typeValidator(type) {
  return (value) => {
    if (value == null) {
      return true;
    }

    const typeName = getTypeName(type);
    const isValid = value instanceof type || typeof value === typeName;

    if (isValid) {
      return true;
    }

    switch (typeName) {
      case 'number':
        return isFinite(+value);
      case 'boolean': {
        const str = `${value}`;
        return str === 'true' || str === 'false' || str === '0' || str === '1';
      }
      default:
        return false;
    }
  };
}

/* Number */

export function minValidator(min) {
  return value => +value >= +min;
}

export function maxValidator(max) {
  return value => +value <= +max;
}

/* End Number */

/* String */

export function minLengthValidator(min) {
  return value => value == null || value.length >= +min;
}

export function maxLengthValidator(max) {
  return value => value == null || value.length <= +max;
}

export function matchValidator(regExp) {
  return (value) => {
    if (!regExp) {
      return false;
    }
    return value ? regExp.test(value) : true;
  };
}

/* End String */

export function equalsValidator(otherProp) {
  return (value, target) => value === target[otherProp];
}

export function enumValidator(...enums) {
  return value => value == null || enums.indexOf(value) >= 0;
}

export function emailValidator() {
  return value => value == null || /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);
}
