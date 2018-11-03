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
  typeValidator,
  Validator,
} from './validators';

export interface ValidableProperty {
  validator: Validator;
  message: string;
  order?: number;
}

export interface ValidationErrors {
  [key: string]: { error?: string };
}

export interface Validatable {
  validate(propName?: PropertyKey): ValidationErrors;
}

function propValidatorsName(prop: PropertyKey) {
  return `_${prop.toString()}Validators`;
}

function orderCompare(a: ValidableProperty, b: ValidableProperty): number {
  // return (!a.order && 100) - (!b.order && 100);
  return (a.order ? a.order : 100) - (b.order ? b.order : 100);
}

export function validate(target: object, propName?: PropertyKey): ValidationErrors {
  return (propName ? [propName] : Object.getOwnPropertyNames(target)).reduce((acc, prop) => {
    const propValidators: ValidableProperty[] = target[propValidatorsName(prop)];
    if (propValidators) {
      const notValid = propValidators
        .sort(orderCompare)
        .find(v => !v.validator(target[prop], target, prop));
      acc[prop] = {
        error:
          notValid &&
          notValid.message.replace(/{PROP}/, prop.toString()).replace(/{VALUE}/, target[prop]),
      };
    }
    return acc;
  }, {});
}

type ValidatableReturnType<TP> = TP extends Function
  ? (TP & Validatable)
  : <TFunction extends Function>(target: TFunction) => TFunction & Validatable;

export function validatable<TP extends Function | string>(
  targetOrProp: TP
): ValidatableReturnType<TP> {
  /* eslint-disable no-shadow, no-param-reassign */
  const originalValidate = validate;

  if (typeof targetOrProp === 'string') {
    const validationErrorsProperty = targetOrProp;

    return (target => {
      target.prototype.validate = function validate(prop: string) {
        if (!(validationErrorsProperty in this)) {
          Object.defineProperty(this, validationErrorsProperty, { value: {} });
        }
        const validationErrors = {
          ...this[validationErrorsProperty],
          ...originalValidate(this, prop),
        };
        return prop
          ? !validationErrors[prop].error
          : Object.getOwnPropertyNames(validationErrors).every(p => !validationErrors[p].error);
      };
      return target;
    }) as ValidatableReturnType<TP>;
  }

  (targetOrProp as Function).prototype.validate = function validate(prop: string) {
    return originalValidate(this, prop);
  };

  return targetOrProp as ValidatableReturnType<TP>;
}

export function addValidator({
  validator,
  message,
  order = 0,
}: ValidableProperty): PropertyDecorator {
  return (target, name) => {
    const propName = propValidatorsName(name);
    if (!(propName in target)) {
      Object.defineProperty(target, propName, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: [],
      });
    }
    target[propName].push({ validator, message, order });
  };
}

export function validators(...items: any[]) {
  return (target: any, name: string, desc: PropertyDescriptor) => {
    items.forEach(v => v(target, name, desc));
    return desc;
  };
}

export function required(message?: string) {
  const msg = message || messages.required;
  return addValidator({ validator: requiredValidator(), message: msg, order: 1 });
}

export function type(requiredType: any, message?: string) {
  const msg = (message || messages.type).replace(/{TYPE}/, getTypeName(requiredType));
  return addValidator({ validator: typeValidator(requiredType), message: msg, order: 2 });
}

export function min(minValue: number, message?: string) {
  const msg = (message || messages.number.min).replace(/{MIN}/, minValue.toString());
  return addValidator({ validator: minValidator(minValue), message: msg });
}

export function max(maxValue: number, message?: string) {
  const msg = (message || messages.number.max).replace(/{MAX}/, maxValue.toString());
  return addValidator({ validator: maxValidator(maxValue), message: msg });
}

export function minLength(minValue: number, message?: string) {
  const msg = (message || messages.string.minLength).replace(/{MINLENGTH}/, minValue.toString());
  return addValidator({ validator: minLengthValidator(minValue), message: msg });
}

export function maxLength(maxValue: number, message?: string) {
  const msg = (message || messages.string.maxLength).replace(/{MAXLENGTH}/, maxValue.toString());
  return addValidator({ validator: maxLengthValidator(maxValue), message: msg });
}

export function match(regExp: RegExp, message?: string) {
  const msg = message || messages.string.match;
  return addValidator({ validator: matchValidator(regExp), message: msg });
}

export function oneOf(enums: any[], message?: string) {
  const msg = message || messages.oneOf;
  return addValidator({ validator: enumValidator(...enums), message: msg });
}

export function email(message?: string) {
  const msg = message || messages.email;
  return addValidator({ validator: emailValidator(), message: msg });
}

export function equals(otherProp: string, message?: string) {
  const msg = (message || messages.equals).replace(/{PROP2}/, otherProp);
  return addValidator({ validator: equalsValidator(otherProp), message: msg });
}
