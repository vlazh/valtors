/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  ...require('@js-toolkit/configs/eslint/common'),

  {
    rules: {
      'no-use-before-define': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
