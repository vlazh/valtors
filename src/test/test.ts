import { email, required, propEquals } from '../decorators';
import { validatable } from '../validatable';

// @validatable.decorator({ resultProp: 'aaa' })
// @validatable.decorator
class AuthCredentials {
  @required()
  @email()
  username = '';

  @required({ type: 'error', message: 'Password is required' })
  password = '';

  @propEquals('password')
  password2 = '';

  constructor(readonly a: number) {}
}

const AAA = validatable(AuthCredentials, { resultProp: 'err' });
const a = new AAA(0);
console.log(a.validate());
console.log(a.err);
console.log(a);

console.log('*******');

const b = validatable({ a: 0, m() {} }, { resultProp: 'res' });
console.log(b.validate());
console.log(b.res);
