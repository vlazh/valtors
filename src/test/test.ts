import { email, required, propEquals, validatable as validatableDec } from '../decorators';
import { validatable } from '../validatable';

@validatableDec({})
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

// type A = Validatable<typeof AuthCredentials, 'aaa'>['prototype']['']

const AAA = validatable(AuthCredentials, { resultProp: 'err', validators: {} });
const a = new AAA(0);
console.log(a.validate());
console.log(a.err);
console.log(a);

console.log('*******');

const b = validatable({ a: 0, m() {} }, { resultProp: 'res' });
console.log(b.validate());
console.log(b.res);
