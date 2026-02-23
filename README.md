# Valtors

[![npm package](https://img.shields.io/npm/v/valtors.svg?style=flat-square)](https://www.npmjs.org/package/valtors)
[![license](https://img.shields.io/npm/l/valtors.svg?style=flat-square)](https://www.npmjs.org/package/valtors)

Small, flexible, and extensible validation library for TypeScript/JavaScript. Provides [TC39 decorators](https://github.com/tc39/proposal-decorators) for classes and properties. Works great with [MobX](https://mobx.js.org/).

## Install

```bash
yarn add valtors
# or
npm install valtors
```

## Features

- Built-in validators: `required`, `email`, `min`, `max`, `minLength`, `maxLength`, `match`, `oneOf`, `propEquals`, `dateString`
- Class decorator `@validatable` injects `validate()` method and validation errors property
- Property decorators for declarative validation
- Async validation support
- Custom validators and error messages
- TypeScript-first with full type safety

## API Overview

| Export | Description |
|--------|-------------|
| `required`, `email`, `min`, `max`, `minLength`, `maxLength` | Built-in validators |
| `match`, `oneOf`, `propEquals`, `dateString` | Pattern and comparison validators |
| `validate` | Validate an object or a single property |
| `@validatable` | Class decorator that adds validation support |
| Property decorators (`@required`, `@email`, etc.) | Declarative property validation |
| `assertions` | Low-level assertion functions |
| `messages` | Default error messages (customizable) |
| `async/validate` | Async version of validate |

## Usage

### Basic validation with decorators

```typescript
import { observable, action, makeObservable } from 'mobx';
import { validatable, required, email } from 'valtors/decorators';

@validatable
class AuthStore {
  @required()
  @email()
  accessor username = '';

  @required({ message: 'Password is required' })
  accessor password = '';

  constructor() {
    makeObservable(this, {
      username: observable,
      password: observable,
      submit: action,
    });
  }

  submit(): void {
    if (!this.validate()) return;
    // all fields valid, proceed
  }
}
```

### Custom validation errors property

```typescript
import { validatable } from 'valtors/decorators';

@validatable({ resultProperty: 'errors' })
class FormStore {
  // ...
  // errors will be available as `this.errors` instead of `this.validationErrors`
}
```

### Programmatic validation (without decorators)

```typescript
import { validate } from 'valtors';
import { required, email, minLength } from 'valtors';

const validators = {
  username: [required(), email()],
  password: [required(), minLength(8)],
};

const data = { username: 'test', password: '123' };
const result = validate(data, validators);
// result.username.error / result.password.error
```

### Custom validator

```typescript
import type { Validator, ValueAssertion } from 'valtors';

function noSpaces(message = 'Must not contain spaces'): Validator<ValueAssertion<string>> {
  return {
    type: 'error',
    message,
    assertion: (value: string) => !value.includes(' '),
  };
}
```

## License

[MIT](https://opensource.org/licenses/mit-license.php)

## Repository

[https://github.com/vlazh/valtors](https://github.com/vlazh/valtors)
