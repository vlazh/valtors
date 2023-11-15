/* eslint-disable func-names */
import {
  validatable as validatableFn,
  type DefaultValidationResultProperty,
  type ValidatableOptions,
  type ValidatableConstructor,
} from './validatable';
import { validate, type ValidateOptions } from './validate';
import * as valtors from './validators';

export type FieldDecorator<T extends AnyObject = AnyObject> = (
  target: undefined,
  context: ClassFieldDecoratorContext<T>
) => void;

export type ClassDecorator<T extends AnyConstructor, R = void> = (
  target: T,
  context: ClassDecoratorContext<T>
) => R;

export function validatable<
  T extends AnyConstructor,
  RP extends string = DefaultValidationResultProperty,
>(target: T, context: ClassDecoratorContext<T>): ValidatableConstructor<T, RP>;

export function validatable<
  T extends AnyConstructor,
  O extends ValidatableOptions<never, RP>,
  RP extends string,
>(options: O): ClassDecorator<T, ValidatableConstructor<T, RP>>;

export function validatable<
  T extends AnyConstructor,
  O extends ValidatableOptions<never, RP>,
  RP extends string = DefaultValidationResultProperty,
>(
  targetOrOptions: T | O
): ValidatableConstructor<T, RP> | ClassDecorator<T, ValidatableConstructor<T, RP>> {
  if (typeof targetOrOptions === 'function') {
    return validatableFn(targetOrOptions);
  }
  return (target) => {
    return validatableFn<T, RP>(target, targetOrOptions);
  };
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
valtors.Validator): FieldDecorator<T> {
  return (_, context) => {
    return function (this: T, value: unknown) {
      const validatorsPropName = validate.getValidatorsPropName();

      if (!(validatorsPropName in this)) {
        Object.defineProperty(this, validatorsPropName, {
          configurable: true, // It needs for mobx
          enumerable: false,
          writable: false,
          value: {},
        });
      }

      const validators = (this as Record<symbol, NonNullable<ValidateOptions<T>['validators']>>)[
        validatorsPropName
      ];
      const fieldName = context.name as keyof typeof validators;
      if (validators[fieldName] && !Array.isArray(validators[fieldName])) {
        validators[fieldName] = [validators[fieldName] as valtors.Validator];
      }
      if (!validators[fieldName]) {
        validators[fieldName] = [];
      }
      (validators[fieldName] as valtors.Validator[]).push({
        assertion,
        type,
        message,
        // order,
      });

      return value;
    };
  };
}

export function compose(...decorators: FieldDecorator[]): FieldDecorator {
  return (target, name) => {
    decorators.forEach((v) => v(target, name));
  };
}

export function required(...args: Parameters<typeof valtors.required>): FieldDecorator {
  return addValidator(valtors.required(...args));
}

export function min(...args: Parameters<typeof valtors.min>): FieldDecorator {
  return addValidator(valtors.min(...args));
}

export function max(...args: Parameters<typeof valtors.max>): FieldDecorator {
  return addValidator(valtors.max(...args));
}

export function minLength(...args: Parameters<typeof valtors.minLength>): FieldDecorator {
  return addValidator(valtors.minLength(...args));
}

export function maxLength(...args: Parameters<typeof valtors.maxLength>): FieldDecorator {
  return addValidator(valtors.maxLength(...args));
}

export function match(...args: Parameters<typeof valtors.match>): FieldDecorator {
  return addValidator(valtors.match(...args));
}

export function oneOf(...args: Parameters<typeof valtors.oneOf>): FieldDecorator {
  return addValidator(valtors.oneOf(...args));
}

export function email(...args: Parameters<typeof valtors.email>): FieldDecorator {
  return addValidator(valtors.email(...args));
}

export function propEquals<T extends AnyObject>(
  ...args: Parameters<typeof valtors.propEquals>
): FieldDecorator<T> {
  return addValidator(valtors.propEquals(...args));
}

export function dateString(...args: Parameters<typeof valtors.dateString>): FieldDecorator {
  return addValidator(valtors.dateString(...args));
}
