import { email, required, validatable } from '../validation';

// @validatable('validationErrors')
@validatable
class AuthCredentials {
  @required()
  @email()
  username: string = '';

  @required('Password is required')
  password: string = '';

  validationErrors = { username: {}, password: {} };

  // validate0(prop) {
  // this
  // }
  //   Object.assign(this.validationErrors, validate(this, prop));
  //   return prop
  //       ? !this.validationErrors[prop].error
  //       : Object.getOwnPropertyNames(this.validationErrors).every(p => !this.validationErrors[p].error);
  // }
}

console.log('*******');
const obj = new AuthCredentials();
// console.log(obj.validate);
// console.log(obj.validate());
console.log(obj.validationErrors);
