module.exports = {
  root: true,
  extends: require.resolve('@js-toolkit/configs/eslint/common'),
  rules: {
    'no-use-before-define': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
  },
};
