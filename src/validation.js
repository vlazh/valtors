import messages from './messages';
import {
  emailValidator,
  enumValidator,
  equalsValidator,
  getTypeName,
  matchValidator,
  maxLengthValidator,
  maxValidator,
  minLengthValidator,
  minValidator,
  requiredValidator,
  typeValidator
} from './validators';


function propValidatorsName(prop) { return `_${prop}Validators`; }

function orderCompare(a, b) {
  return (!a.order && 100) - (!b.order && 100);
}

export function validate(target, propName = null) {
  return (propName ? [propName] : Object.getOwnPropertyNames(target))
      .reduce((acc, prop) => {
        const propValidators = target[propValidatorsName(prop)];
        if (propValidators) {
          const notValid = propValidators
              .sort(orderCompare)
              .find(v => !v.validator(target[prop], target, prop));
          acc[prop] = {
            error: notValid && notValid.message.replace(/{PROP}/, prop).replace(/{VALUE}/, target[prop]),
          };
        }
        return acc;
      }, {});
}

export function addValidator({ validator, message, order = 0 }) {
  return (target, name, desc) => {
    const propName = propValidatorsName(name);
    if (!(propName in target)) {
      Object.defineProperty(target, propName, { configurable: false, enumerable: false, writable: false, value: [] });
    }
    target[propName].push({ validator, message, order });
    return desc;
  };
}

export function validators(...items) {
  return (target, name, desc) => {
    items.forEach(v => v(target, name, desc));
    return desc;
  };
}

export function required(message) {
  const msg = (message || messages.required);
  return addValidator({ validator: requiredValidator(), message: msg, order: 1 });
}

export function type(requiredType, message) {
  const msg = (message || messages.type).replace(/{TYPE}/, getTypeName(requiredType));
  return addValidator({ validator: typeValidator(requiredType), message: msg, order: 2 });
}

export function min(minValue, message) {
  const msg = (message || messages.Number.min).replace(/{MIN}/, minValue);
  return addValidator({ validator: minValidator(minValue), message: msg });
}

export function max(maxValue, message) {
  const msg = (message || messages.Number.max).replace(/{MAX}/, maxValue);
  return addValidator({ validator: maxValidator(maxValue), message: msg });
}

export function minLength(minValue, message) {
  const msg = (message || messages.String.minLength).replace(/{MINLENGTH}/, minValue);
  return addValidator({ validator: minLengthValidator(minValue), message: msg });
}

export function maxLength(maxValue, message) {
  const msg = (message || messages.String.maxLength).replace(/{MAXLENGTH}/, maxValue);
  return addValidator({ validator: maxLengthValidator(maxValue), message: msg });
}

export function match(regExp, message) {
  const msg = (message || messages.String.match);
  return addValidator({ validator: matchValidator(regExp), message: msg });
}

export function oneOf(enums, message) {
  const msg = (message || messages.oneOf);
  return addValidator({ validator: enumValidator(...enums), message: msg });
}

export function email(message) {
  const msg = (message || messages.email);
  return addValidator({ validator: emailValidator(), message: msg });
}

export function equals(otherProp, message) {
  const msg = (message || messages.equals).replace(/{PROP2}/, otherProp);
  return addValidator({ validator: equalsValidator(otherProp), message: msg });
}
