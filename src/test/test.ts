import { email, required, ValidatorType, equals } from '../validatorsDecorators';
import validatable from '../validatableDecorator';

@validatable
// @validatable('validationErrors')
class AuthCredentials {
  @required()
  @email()
  username: string = '';

  @required(ValidatorType.ERROR, 'Password is required')
  password: string = '';

  @equals('password')
  password2: string = '';
}

const A = validatable('err')(AuthCredentials);
const a = new A();
console.log(a.validate());
console.log(a.err);
console.log(a);

console.log('*******');
const obj = new AuthCredentials();
obj.password = '123';
console.log((obj as any).validate());
console.log((obj as any).err);
console.log(obj);
console.log(a);
