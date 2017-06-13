const msg = {};

msg.type = 'Value must be instance of `{TYPE}`.';
msg.required = 'Value is required.';
msg.oneOf = 'Value is not valid enum value.';
msg.email = 'Value is not valid email.';
msg.equals = 'Value must be equals to {PROP2}.';

msg.Number = {};
msg.Number.min = 'Value is less than minimum allowed value `{MIN}`.';
msg.Number.max = 'Value is more than maximum allowed value `{MAX}`.';

msg.String = {};
msg.String.minLength = 'Value is shorter than the minimum allowed length `{MINLENGTH}`.';
msg.String.maxLength = 'Value is longer than the maximum allowed length `{MAXLENGTH}`.';
msg.String.match = 'Value do not match to regex.';

msg.Date = {};
msg.Date.min = 'Value is before minimum allowed value `{MIN}`.';
msg.Date.max = 'Value is after maximum allowed value `{MAX}`.';


export default msg;
