import { validate as validateFn, type ValidationResult, type ValidateOptions } from './validate';

export interface ValidatableConstructor<T extends AnyConstructor, ResultProp extends string> {
  readonly prototype: WithIndex<T>['prototype'] &
    Pick<ValidatableObject<InstanceType<T>, ResultProp>, 'validate'>;
  // readonly [Symbol.species]: T;
  new (...args: ConstructorParameters<T>): ValidatableObject<InstanceType<T>, ResultProp>;
}
// (T extends AnyConstructor
//   ? { new (...args: ConstructorParameters<T>): Validatable<T['prototype'], ResultProp> }
//   : { new (): Validatable<T['prototype'], ResultProp> });

// Hack:
// For instance: createStore(validatable()) - in this case ResultProp is a string because the object
// has no prop with type ResultProp (TS specifics). So just create a prop with type ResultProp and
// remap it to a prop named as ResultProp.
type Remap<T extends { __prop_map__: string }, V> = {
  [P in keyof T as P extends '__prop_map__' ? T[P] : never]: V;
};

export type ValidatableObject<T extends AnyObject, ResultProp extends string> = T &
  Remap<{ __prop_map__: ResultProp }, ValidationResult<keyof T>> & {
    validate(propName?: keyof T | undefined): boolean;
  };

export type Validatable<T extends AnyObject, ResultProp extends string> = T extends AnyConstructor
  ? ValidatableConstructor<T, ResultProp>
  : ValidatableObject<T, ResultProp>;

export type DefaultValidationResultProperty = 'validation';
const defaultValidationResultProperty: DefaultValidationResultProperty = 'validation';

export interface ValidatableOptions<T extends AnyObject, RP extends string>
  extends ValidateOptions<T> {
  readonly resultProp?: RP | undefined;
}

export function validatable<
  T extends AnyObject,
  RP extends string = DefaultValidationResultProperty,
>(
  target: /* T extends AnyConstructor ? T : */ T & ThisType<Validatable<T, RP>>,
  { resultProp = defaultValidationResultProperty as RP, ...rest }: ValidatableOptions<T, RP> = {}
): Validatable<T, RP> {
  // Class
  if (target instanceof Function) {
    const Base = target as T & AnyConstructor;
    return class extends Base {
      constructor(...args: unknown[]) {
        super(...args);
        this[resultProp] = {} as (typeof this)[RP];
      }

      validate(this: T, propName?: keyof T | undefined): boolean {
        const validationResult = {
          ...this[resultProp],
          ...validateFn(this, propName, rest),
        };

        this[resultProp] = validationResult;

        return propName
          ? !validationResult[propName]?.message
          : Object.getOwnPropertyNames(validationResult).every(
              (p) => !validationResult[p as keyof typeof validationResult]?.message
            );
      }
    } as Validatable<T, RP>;

    // const Ctor = function (this: Validatable<AnyObject, RP>, ...params: unknown[]): void {
    //   target.call(this, ...params);
    //   this[resultProp] = {} as (typeof this)[RP];
    // };
    // Ctor.prototype = Object.create(target.prototype);
    // Object.defineProperty(Ctor.prototype, 'constructor', {
    //   value: Ctor,
    //   enumerable: false,
    //   writable: true,
    // });

    // Ctor.prototype.validate = function (this: T, propName?: keyof T | undefined): boolean {
    //   const validationResult = {
    //     ...this[resultProp],
    //     ...validateFn(this, propName, rest),
    //   };

    //   this[resultProp] = validationResult;

    //   return propName
    //     ? !validationResult[propName]?.message
    //     : Object.getOwnPropertyNames(validationResult).every(
    //         (p) => !validationResult[p as keyof typeof validationResult]?.message
    //       );
    // };

    // return Ctor as unknown as Validatable<T, RP>;
  }

  return Object.assign(target, {
    [resultProp]: {},

    validate(this: T, propName: keyof T) {
      const validationResult = {
        ...this[resultProp],
        ...validateFn(this, propName, rest),
      } as ValidationResult<keyof T>;

      this[resultProp] = validationResult as T[RP];

      return propName
        ? !!validationResult[propName]?.valid || !validationResult[propName]?.message
        : Object.getOwnPropertyNames(validationResult).every((p: keyof typeof validationResult) => {
            return !!validationResult[p]?.valid || !validationResult[p]?.message;
          });
    },
  } as Validatable<T, RP>);
}
