import type { ValidatorConfig, Validator } from './validators';

export type ValidationInfo = ExcludeTypes<ValidatorConfig<any>, AnyFunction>;

export type ValidationResult<
  Props extends PropertyKey,
  R extends ValidationInfo | EmptyObject = ValidationInfo | EmptyObject,
> = {
  readonly [P in Props]?: R | undefined;
};

export type PropsValidators<T extends AnyObject> = {
  readonly [P in keyof T]?: Validator | Validator[];
};

export interface ValidateOptions<T extends AnyObject, K extends keyof T = never> {
  readonly validators?: PropsValidators<T> | undefined;
  readonly testValue?: T[K] | undefined;
}

// function orderCompare<T extends AnyObject>(
//   a: ValidatableProperty<T>,
//   b: ValidatableProperty<T>
// ): number {
//   return (
//     (a.order ? a.order : Number.MAX_SAFE_INTEGER) - (b.order ? b.order : Number.MAX_SAFE_INTEGER)
//   );
// }

/**
 * Validates all properties of the `target` or just the property `propName`.
 * If the `testValue` is provided it will be used instead of `target[propName]`
 */
export function validate<T extends AnyObject, K extends keyof T>(
  target: T,
  propName?: K | undefined,
  options: ValidateOptions<T, K> = {}
): ValidationResult<keyof T> {
  const props = propName ? [propName] : (Object.getOwnPropertyNames(target) as (keyof T)[]);
  return props.reduce(
    (acc, prop) => {
      const targetValidators =
        options.validators ??
        (target[validate.getValidatorsPropName()] as PropsValidators<T>) ??
        {};
      const propValidators = (
        Array.isArray(targetValidators[prop])
          ? targetValidators[prop]
          : targetValidators[prop] && [targetValidators[prop]]
      ) as Extract<(typeof targetValidators)[typeof prop], unknown[]> | undefined;

      if (propValidators) {
        const isTest = propName && 'testValue' in options;
        const propValue = isTest ? options.testValue : target[prop];

        const failed = propValidators
          // .sort(orderCompare)
          .find((v) => !v.assertion(propValue, target, prop));

        acc[prop] = failed
          ? ((): ValidationInfo => {
              const { type, message, assertion, ...rest } = failed;
              return {
                message: (typeof message === 'function'
                  ? message(propValue, target, prop)
                  : message
                )
                  .replace(/{PROP}/, prop.toString())
                  .replace(/{VALUE}/, String(propValue)),
                type,
                ...rest,
              };
            })()
          : {};
      }
      return acc;
    },
    {} as Writeable<ValidationResult<keyof T>>
  );
}

/** Name of special field for validators. */
validate.getValidatorsPropName = (): string => {
  return `__validators__`;
};
