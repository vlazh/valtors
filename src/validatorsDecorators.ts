import messages from './messages';
import {
  Validator,
  emailValidator,
  enumValidator,
  equalsValidator,
  matchValidator,
  maxLengthValidator,
  maxValidator,
  minLengthValidator,
  minValidator,
  requiredValidator,
  dateStringValidator,
} from './validators';

export enum ValidatorType {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
}

export interface ValidableProperty<T extends object> {
  validator: Validator<T>;
  message: string;
  type: ValidatorType;
  order?: number;
}

export type Validators<T extends object> = { [P in keyof T]?: ValidableProperty<T>[] };

/** Name of special field for validators. */
export function getPropValidatorsName(): string {
  return `__validators__`;
}

export type TypedPropertyDecorator<T extends object = {}> = (
  target: T,
  key: never extends T ? string : keyof T
) => void;

/**
 * Returns decorator which adds validator to special field of validators.
 * Useful for implementing own validators.
 */
export function addValidator<T extends object>({
  validator,
  type,
  message,
  order = 0,
}: ValidableProperty<T>): TypedPropertyDecorator<T> {
  return (target, name) => {
    const validatorsPropName = getPropValidatorsName();
    if (!(validatorsPropName in target)) {
      Object.defineProperty(target, validatorsPropName, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {},
      });
    }
    const validators: Validators<T> = target[validatorsPropName];
    validators[name as keyof T] = validators[name as keyof T] || [];
    (validators[name as keyof T] as ValidableProperty<T>[]).push({
      validator,
      type,
      message,
      order,
    });
  };
}

export function required(
  type: ValidatorType = ValidatorType.ERROR,
  message: string = messages.required
): TypedPropertyDecorator {
  return addValidator({ validator: requiredValidator(), type, message, order: 1 });
}

export function min(
  minValue: number,
  type: ValidatorType = ValidatorType.ERROR,
  message?: string
): TypedPropertyDecorator {
  const msg = (message || messages.number.min).replace(/{MIN}/, minValue.toString());
  return addValidator({ validator: minValidator(minValue), type, message: msg });
}

export function max(
  maxValue: number,
  type: ValidatorType = ValidatorType.ERROR,
  message?: string
): TypedPropertyDecorator {
  const msg = (message || messages.number.max).replace(/{MAX}/, maxValue.toString());
  return addValidator({ validator: maxValidator(maxValue), type, message: msg });
}

export function minLength(
  minValue: number,
  type: ValidatorType = ValidatorType.ERROR,
  message?: string
): TypedPropertyDecorator {
  const msg = (message || messages.string.minLength).replace(/{MINLENGTH}/, minValue.toString());
  return addValidator({ validator: minLengthValidator(minValue), type, message: msg });
}

export function maxLength(
  maxValue: number,
  type: ValidatorType = ValidatorType.ERROR,
  message?: string
): TypedPropertyDecorator {
  const msg = (message || messages.string.maxLength).replace(/{MAXLENGTH}/, maxValue.toString());
  return addValidator({ validator: maxLengthValidator(maxValue), type, message: msg });
}

export function match(
  regExp: RegExp,
  type: ValidatorType = ValidatorType.ERROR,
  message: string = messages.string.match
): TypedPropertyDecorator {
  return addValidator({ validator: matchValidator(regExp), type, message });
}

export function oneOf(
  enums: unknown[],
  type: ValidatorType = ValidatorType.ERROR,
  message: string = messages.oneOf
): TypedPropertyDecorator {
  return addValidator({ validator: enumValidator(...enums), type, message });
}

export function email(
  type: ValidatorType = ValidatorType.ERROR,
  message: string = messages.email
): TypedPropertyDecorator {
  return addValidator({ validator: emailValidator(), type, message });
}

export function equals<T extends object>(
  otherProp: keyof T,
  type: ValidatorType = ValidatorType.ERROR,
  message?: string
): TypedPropertyDecorator<T> {
  const msg = (message || messages.equals).replace(/{PROP2}/, String(otherProp));
  return addValidator({ validator: equalsValidator(otherProp), type, message: msg });
}

export function dateString(
  type: ValidatorType = ValidatorType.ERROR,
  message: string = messages.dateString
): TypedPropertyDecorator {
  return addValidator({ validator: dateStringValidator(), type, message });
}
