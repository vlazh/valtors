/* eslint-disable @typescript-eslint/no-explicit-any, no-param-reassign */
import originalValidate, { ValidationErrors } from './validate';

export type Validatable<T extends object, Prop extends string> = {
  [P in Prop]: ValidationErrors<T>
} & {
  validate: (propName?: keyof T) => boolean;
};

type ValidatableConstructor<T extends Function, P extends string> = T & {
  new (...args: any[]): Validatable<T['prototype'], P>;
  prototype: Pick<Validatable<T['prototype'], P>, 'validate'>;
};

type DefaultValidationErrorsProperty = 'validationErrors';
const defaultValidationErrorsProperty: DefaultValidationErrorsProperty = 'validationErrors';

type ValidatableType<TP extends Function | string> = TP extends Function
  ? ValidatableConstructor<TP, DefaultValidationErrorsProperty>
  : <F extends Function>(target: F) => ValidatableConstructor<F, Exclude<TP, Function>>;

function createNewTarget<T extends Function>(target: T, validationErrorsProperty: string): T {
  // @ts-ignore
  return class extends target {
    validate(
      this: typeof target['prototype'],
      propName?: keyof typeof target['prototype']
    ): boolean {
      if (!(validationErrorsProperty in (this as object))) {
        Object.defineProperty(this, validationErrorsProperty, {
          writable: true,
          enumerable: true,
          value: {},
        });
      }
      const validationErrors = {
        ...this[validationErrorsProperty],
        ...originalValidate(this, propName),
      };
      this[validationErrorsProperty] = validationErrors;
      return propName
        ? !validationErrors[propName].error
        : Object.getOwnPropertyNames(validationErrors).every(p => !validationErrors[p].error);
    }
  };
}

/**
 * Returns decorator for class (or constructor function) which implements @type {Validatable}
 * @param targetOrProp property name for validation errors. Default: validationErrors.
 */
export default function validatable<TP extends Function | string>(
  targetOrProp: TP
): ValidatableType<TP> {
  if (typeof targetOrProp === 'string') {
    return (target => createNewTarget(target, targetOrProp)) as ValidatableType<TP>;
  }
  return createNewTarget(
    targetOrProp as Function,
    defaultValidationErrorsProperty
  ) as ValidatableType<TP>;
}
