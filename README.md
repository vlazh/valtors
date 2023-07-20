# Valtors [![npm package](https://img.shields.io/npm/v/valtors.svg?style=flat-square)](https://www.npmjs.org/package/valtors)

**Valtors** is a small flexible and extensible validation library for TypeScript/JavaScript. It provides [decorators](https://github.com/tc39/proposal-decorators) for classes and properties. Perfect worked with [MobX](https://mobx.js.org/).

Class decorator `@validatable` injects method `validate(propName?: keyof this)` and property with validation errors (default is `validationErrors`) which will available after `validate` method will be called.

## React + MobX + Valtors Example

```jsx
// Store for react component

import { action, observable } from 'mobx';
import { email, required, validatable } from 'valtors';

// @validatable without arguments injects `validationErrors` property for validation errors
@validatable('errors')
export default class AuthCredentialsStore {
  @observable
  @required()
  @email()
  username;

  @observable
  @required('Password is required')
  password;

  @action
  submit() {
    // Validate all fields.
    if (!this.validate()) return;
    // If store is valid submit.
  }
}

// React component

import React, { useCallback } from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react-lite';
import styles from './SignIn.css';

function SignIn({ store }) {
  const onSubmit = useCallback(action((e) => {
    e.preventDefault();
    store.submit();
  }), [store]);

  const onChange = useCallback(action(({ target: { name, value } }) => {
    store[name] = value;
    store.validate(name); // Validate only one field.
  }), [store]);

  const { errors } = store;

  return (
    <form onSubmit={onSubmit} noValidate>
      <input value={store.username} onChange={onChange} name="username" type="email" placeholder="email">
      <span className={errors.username.error ? styles['error'] : styles['hide']}>{errors.username.error}</span>

      <input value={store.password} onChange={onChange} name="password" type="password" placeholder="password">
      <span className={errors.password.error ? styles['error'] : styles['hide']}>{errors.password.error}</span>

      <button className={styles['btn-login']} type="submit">Login</button>
    </form>
  );
}

export default observer(SignIn);
```

## License

[MIT](https://opensource.org/licenses/mit-license.php)
