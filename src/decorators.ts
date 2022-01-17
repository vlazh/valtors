/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */
import { validate } from './validate';
import {
  DefaultValidationResultProperty,
  validatable as validatableFn,
  ValidatableConstructor,
  ValidatableOptions,
} from './validatable';
import type { PropsValidators } from './validate';
import * as valtors from './validators';

export type TypedPropertyDecorator<T extends AnyObject = AnyObject> = (
  target: T,
  key: never extends T ? string : keyof T
) => void;

type ValidatableDecorator<
  T extends Function | ValidatableOptions<any, RP>,
  RP extends string
> = T extends Function
  ? ValidatableConstructor<T, DefaultValidationResultProperty>
  : <F extends Function>(target: F) => ValidatableConstructor<F, RP>;

export function validatable<T extends Function | ValidatableOptions<any, RP>, RP extends string>(
  targetOrOptions: T
): ValidatableDecorator<T, RP> {
  if (typeof targetOrOptions === 'function') {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return validatableFn(targetOrOptions as Function) as ValidatableDecorator<T, RP>;
  }

  return ((target) => {
    return validatableFn(target, targetOrOptions) as typeof target;
  }) as ValidatableDecorator<T, RP>;
}

/**
 * Returns decorator which adds validator to special field of validators.
 * Useful for implementing own validators.
 */
export function addValidator<T extends AnyObject>({
  assertion,
  type,
  message,
}: // order = 0,
valtors.Validator): TypedPropertyDecorator<T> {
  return (target, name) => {
    const validatorsPropName = validate.getValidatorsPropName();
    if (!(validatorsPropName in target)) {
      Object.defineProperty(target, validatorsPropName, {
        configurable: false,
        enumerable: false,
        writable: false,
        value: {},
      });
    }
    const validators = target[validatorsPropName] as Writeable<PropsValidators<T>>;
    validators[name as keyof T] = validators[name as keyof T] || [];
    (validators[name as keyof T] as valtors.Validator[]).push({
      assertion,
      type,
      message,
      // order,
    });
  };
}

export function compose(...decorators: TypedPropertyDecorator[]): TypedPropertyDecorator {
  return (target, name) => {
    decorators.forEach((v) => v(target, name));
  };
}

export function required(...args: Parameters<typeof valtors.required>): TypedPropertyDecorator {
  return addValidator(valtors.required(...args));
}

export function min(...args: Parameters<typeof valtors.min>): TypedPropertyDecorator {
  return addValidator(valtors.min(...args));
}

export function max(...args: Parameters<typeof valtors.max>): TypedPropertyDecorator {
  return addValidator(valtors.max(...args));
}

export function minLength(...args: Parameters<typeof valtors.minLength>): TypedPropertyDecorator {
  return addValidator(valtors.minLength(...args));
}

export function maxLength(...args: Parameters<typeof valtors.maxLength>): TypedPropertyDecorator {
  return addValidator(valtors.maxLength(...args));
}

export function match(...args: Parameters<typeof valtors.match>): TypedPropertyDecorator {
  return addValidator(valtors.match(...args));
}

export function oneOf(...args: Parameters<typeof valtors.oneOf>): TypedPropertyDecorator {
  return addValidator(valtors.oneOf(...args));
}

export function email(...args: Parameters<typeof valtors.email>): TypedPropertyDecorator {
  return addValidator(valtors.email(...args));
}

export function propEquals<T extends AnyObject>(
  ...args: Parameters<typeof valtors.propEquals>
): TypedPropertyDecorator<T> {
  return addValidator(valtors.propEquals(...args));
}

export function dateString(...args: Parameters<typeof valtors.dateString>): TypedPropertyDecorator {
  return addValidator(valtors.dateString(...args));
}
