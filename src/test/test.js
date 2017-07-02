import { email, required, validate, validatable } from '../validation';

@validatable
class AuthCredentials {

  @required() @email()
  username;

  @required('Password is required')
  password;

  // validationErrors = { username: {}, password: {} };

  // validate(prop) {
  //   Object.assign(this.validationErrors, validate(this, prop));
  //   return prop
  //       ? !this.validationErrors[prop].error
  //       : Object.getOwnPropertyNames(this.validationErrors).every(p => !this.validationErrors[p].error);
  // }
}

console.log('*******');
const obj = new AuthCredentials();
console.log(obj.validate);
console.log(obj.validate());