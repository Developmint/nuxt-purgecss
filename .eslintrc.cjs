module.exports = {
  extends: ['@nuxtjs/eslint-config-typescript'],
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        'no-console': 'off'
      }
    }
  ]
}