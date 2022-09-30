# Nuxt PurgeCSS - Drop superfluous CSS!

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Github Actions CI][github-actions-ci-src]][github-actions-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]
[![thanks](https://img.shields.io/badge/thanks-%E2%99%A5-ff69b4.svg)](https://thanks.lichter.io/)

[📖 **Release Notes**](./CHANGELOG.md)

## Features

* Remove unneeded CSS with ease
* Sane default settings
* Built on top of [purgecss](https://github.com/FullHuman/purgecss)
* Nuxt 2 and Nuxt 3 support (Use v1.0.0 for Nuxt2 support for now)
* Fully tested!

## Setup

1. Add `nuxt-purgecss` dependency to your project

```bash
yarn add --dev nuxt-purgecss # or npm install --save-dev nuxt-purgecss
```

2. Add `nuxt-purgecss` to the `modules` section of `nuxt.config.{js,ts}`

```js
export default {
  modules: [
    // Simple usage
    'nuxt-purgecss',

    // With options
    ['nuxt-purgecss', { /* module options */ }],
  ]
}
```

:warning: If you are using Nuxt **2**, please use version 1 of the module.

## Options

### Defaults

Before diving into the individual attributes, please have a look [at the default settings](https://github.com/Developmint/nuxt-purgecss/blob/main/src/config.ts) of the module.

The defaults will scan all your `.vue`, `.js` and `.ts` files in the common Nuxt folders, as well as checking your `nuxt.config.js` (or `.ts`) for used classes.
Furthermore, typical classes (like these needed for transitions, the nuxt link ones or those set when using scoped styles) are whitelisted already.

These settings should be a good foundation for a variety of projects.

### Properties in-depth

#### enabled

* Type: `Boolean`
* Default: `!nuxt.options.dev` (Disabled during `nuxt dev`, enabled otherwise)

Enables the module when set to `true`.

#### PurgeCSS options

Please read [the PurgeCSS docs](https://www.purgecss.com/configuration) for information about
PurgeCSS-related information.

## Examples

### Default setup

```js
// nuxt.config.js
export default {
  modules: [
    'nuxt-purgecss',
  ]
}
```

### Customize options

```js
//nuxt.config.js
export default {
  modules: [
    'nuxt-purgecss',
  ],

  purgecss: {
    enabled: true, // Always enable purgecss
    safelist: ['my-class'], // Add my-class token to the safelist (e.g. .my-class)
  }
}
```

## Caveats

* Don't forget to add paths to pages and components that are not part the common folders (e.g. third party packages)
* The default generated 500 and 404 pages will be purged by default. Please ensure you have an appropriate error layout
* Do not use the old `>>>` or `::v-deep` syntax. Instead, go for `:deep`

## Migrating from v1.x

:warning: If you use Nuxt 2, you can't update to v2.x (yet?)

1. The webpack mode has been removed, as Nuxt 3 supports Vite and webpack. This way, the logic is unified to use the PostCSS plugin of PurgeCSS. There is no `mode` anymore
2. The config merging logic of v1 has been removed in favor of using [`defu`](https://github.com/unjs/defu). Instead of using functions, write your values as usual and they will be merged.
3. PurgeCSS has been bumped from v2.x to v5.x - Please check the current [config options](https://purgecss.com/configuration.html#options)
4. Change the module key has been changed to just `purgecss`.
5. In addition to `enabled`, all purgecss configurations can be written directly into the `purgecss` object.
6. Eventually, check out the playground of the module and the [current defaults]([at the default settings](https://github.com/Developmint/nuxt-purgecss/blob/main/src/config.ts))!


## License

[MIT License](./LICENSE)

Copyright (c) Alexander Lichter

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/nuxt-purgecss/latest.svg
[npm-version-href]: https://npmjs.com/package/nuxt-purgecss

[npm-downloads-src]: https://img.shields.io/npm/dt/nuxt-purgecss.svg
[npm-downloads-href]: https://npmjs.com/package/nuxt-purgecss

[github-actions-ci-src]: https://github.com/Developmint/nuxt-purgecss/workflows/ci/badge.svg
[github-actions-ci-href]: https://github.com/Developmint/nuxt-purgecss/actions?query=workflow%3Aci

[codecov-src]: https://img.shields.io/codecov/c/github/Developmint/nuxt-purgecss.svg
[codecov-href]: https://codecov.io/gh/Developmint/nuxt-purgecss

[license-src]: https://img.shields.io/npm/l/nuxt-purgecss.svg
[license-href]: https://npmjs.com/package/nuxt-purgecss
