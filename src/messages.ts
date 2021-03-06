export default {
  required: 'Value is required.',
  oneOf: 'Value is not valid enum value.',
  email: 'Value is not valid email.',
  equals: 'Value must be equals to {PROP2}.',
  dateString: 'Value is not valid date.',

  number: {
    min: 'Value is less than minimum allowed value `{MIN}`.',
    max: 'Value is more than maximum allowed value `{MAX}`.',
  },

  string: {
    minLength: 'Value is shorter than the minimum allowed length `{MINLENGTH}`.',
    maxLength: 'Value is longer than the maximum allowed length `{MAXLENGTH}`.',
    match: 'Value do not match to regex.',
  },
};
