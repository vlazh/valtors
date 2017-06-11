const msg = {};

msg.type = 'Value `{VALUE}` of `{PROP}` must be instance of `{TYPE}`.';
msg.required = '`{PROP}` is required.';
msg.oneOf = 'Value `{VALUE}` of `{PROP}` is not valid enum value.';
msg.email = 'Value `{VALUE}` of `{PROP}` is not valid email.';
msg.equals = 'Value `{VALUE}` of `{PROP}` must be equals to {PROP2}.';

msg.Number = {};
msg.Number.min = 'Value `{VALUE}` of `{PROP}` is less than minimum allowed value `{MIN}`.';
msg.Number.max = 'Value `{VALUE}` of `{PROP}` is more than maximum allowed value `{MAX}`.';

msg.String = {};
msg.String.minLength = 'Value `{VALUE}` of `{PROP}` is shorter than the minimum allowed length `{MINLENGTH}`.';
msg.String.maxLength = 'Value `{VALUE}` of `{PROP}` is longer than the maximum allowed length `{MAXLENGTH}`.';
msg.String.match = 'Value `{VALUE}` of `{PROP}` do not match to regex.';

msg.Date = {};
msg.Date.min = 'Value `{VALUE}` of `{PROP}` is before minimum allowed value `{MIN}`.';
msg.Date.max = 'Value `{VALUE}` of `{PROP}` is after maximum allowed value `{MAX}`.';


export default msg;
