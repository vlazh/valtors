import type { GetOverridedKeys } from '@jstoolkit/utils/types/augmentation';
import messages from './messages';
import * as assertions from './assertions';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ValidatorTypes {}

export type ValidatorType = GetOverridedKeys<'error' | 'warn' | 'info', ValidatorTypes>;

export type ValueAssertion<V = unknown> = (value: V) => boolean;

export type TargetValueAssertion<T extends AnyObject, V = unknown> = (
  value: V,
  target: T,
  prop: keyof T
) => boolean;

type MessageBuilder<A extends ValueAssertion<any> | TargetValueAssertion<any, any>> = (
  ...args: Parameters<A>
) => string;

export interface ValidatorConfig<A extends ValueAssertion<any> | TargetValueAssertion<any, any>> {
  readonly type: ValidatorType;
  readonly message: string | MessageBuilder<A>;
  readonly valid?: boolean | undefined;
}

export interface Validator<
  A extends ValueAssertion<any> | TargetValueAssertion<any, any> =
    | ValueAssertion<any>
    | TargetValueAssertion<any, any>
> extends ValidatorConfig<A> {
  readonly assertion: A;
}

export type ValidatorOptions<A extends ValueAssertion<any> | TargetValueAssertion<any, any>> =
  Partial<ValidatorConfig<A>>;

function getMessageText<A extends ValueAssertion<any> | TargetValueAssertion<any, any>>(
  message: NonNullable<ValidatorOptions<A>['message']>,
  ...params: Parameters<MessageBuilder<A>>
): string {
  return typeof message === 'function' ? message(...params) : message;
}

export function required({
  type = 'error',
  message = messages.required,
  ...rest
}: ValidatorOptions<ValueAssertion<unknown>> = {}): Validator<ValueAssertion<unknown>> {
  return { assertion: assertions.required(), type, message, ...rest };
}

export function min(
  minValue: number,
  {
    type = 'error',
    message = messages.number.min,
    ...rest
  }: ValidatorOptions<ValueAssertion<number>> = {}
): Validator<ValueAssertion<number>> {
  const msg: MessageBuilder<ValueAssertion<number>> = (...params): string =>
    getMessageText<ValueAssertion<number>>(message, ...params).replace(
      /{MIN}/,
      minValue.toString()
    );
  return { assertion: assertions.min(minValue), type, message: msg, ...rest };
}

export function max(
  maxValue: number,
  {
    type = 'error',
    message = messages.number.max,
    ...rest
  }: ValidatorOptions<ValueAssertion<number>> = {}
): Validator<ValueAssertion<number>> {
  const msg: MessageBuilder<ValueAssertion<number>> = (...params) =>
    getMessageText(message, ...params).replace(/{MAX}/, maxValue.toString());
  return { assertion: assertions.max(maxValue), type, message: msg, ...rest };
}

export function minLength(
  minValue: number,
  {
    type = 'error',
    message = messages.string.minLength,
    ...rest
  }: ValidatorOptions<ValueAssertion<number>> = {}
): Validator<ValueAssertion<number>> {
  const msg: MessageBuilder<ValueAssertion<number>> = (...params) =>
    getMessageText(message, ...params).replace(/{MINLENGTH}/, minValue.toString());
  return { assertion: assertions.minLength(minValue), type, message: msg, ...rest };
}

export function maxLength(
  maxValue: number,
  {
    type = 'error',
    message = messages.string.maxLength,
    ...rest
  }: ValidatorOptions<ValueAssertion<number>> = {}
): Validator<ValueAssertion<number>> {
  const msg: MessageBuilder<ValueAssertion<number>> = (...params) =>
    getMessageText(message, ...params).replace(/{MAXLENGTH}/, maxValue.toString());
  return { assertion: assertions.maxLength(maxValue), type, message: msg, ...rest };
}

export function match(
  regExp: RegExp,
  {
    type = 'error',
    message = messages.string.match,
    ...rest
  }: ValidatorOptions<ValueAssertion<string>> = {}
): Validator<ValueAssertion<string>> {
  return { assertion: assertions.match(regExp), type, message, ...rest };
}

export function oneOf(
  list: unknown[],
  {
    type = 'error',
    message = messages.oneOf,
    ...rest
  }: ValidatorOptions<ValueAssertion<unknown>> = {}
): Validator<ValueAssertion<unknown>> {
  return { assertion: assertions.oneOf(...list), type, message, ...rest };
}

export function email({
  type = 'error',
  message = messages.email,
  ...rest
}: ValidatorOptions<ValueAssertion<string>> = {}): Validator<ValueAssertion<string>> {
  return { assertion: assertions.email(), type, message, ...rest };
}

export function propEquals<T extends AnyObject>(
  otherProp: keyof T,
  {
    type = 'error',
    message = messages.equals,
    ...rest
  }: ValidatorOptions<ValueAssertion<unknown>> = {}
): Validator<TargetValueAssertion<T, unknown>> {
  const msg: MessageBuilder<ValueAssertion<unknown>> = (...params) =>
    getMessageText(message, ...params).replace(/{PROP2}/, String(otherProp));
  return { assertion: assertions.equals(otherProp), type, message: msg, ...rest };
}

export function dateString({
  type = 'error',
  message = messages.dateString,
  ...rest
}: ValidatorOptions<ValueAssertion<string>> = {}): Validator<ValueAssertion<string>> {
  return { assertion: assertions.dateString(), type, message, ...rest };
}
