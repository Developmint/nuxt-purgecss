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
* Webpack or PostCSS mode
* Already comes with mighty default settings
* Built on top of [purgecss](https://github.com/FullHuman/purgecss)
* Nuxt 2 (and only Nuxt 2) support
* Fully tested!

## Setup

1. Add `nuxt-purgecss` dependency to your project

```bash
yarn add --dev nuxt-purgecss # or npm install --save-dev nuxt-purgecss
```

2. Add `nuxt-purgecss` to the `buildModules` section of `nuxt.config.js`

```js
export default {
  buildModules: [
    // Simple usage
    'nuxt-purgecss',

    // With options
    ['nuxt-purgecss', { /* module options */ }]
  ]
}
```

:warning: If you are using Nuxt **< v2.9** you have to install the module as a `dependency` (No `--dev` or `--save-dev` flags) and use `modules` section in `nuxt.config.js` instead of `buildModules`.


## Options

### Defaults

Before diving into the individual attributes, please have a look [at the default settings](https://github.com/Developmint/nuxt-purgecss/blob/master/lib/utils.js) of the module.

The defaults will scan all your `.vue` or `.js` components in the common Nuxt folders, as well as checking your `nuxt.config.js` for used classes.
Furthermore, typical classes (like these needed for transitions, the nuxt link ones or those set when using scoped styles) are whitelisted already.

These settings should be a good foundation for a variety of projects.

### Merging defaults

You can define every option either as function or as static value (primitives, objects, arrays, ...).
if you use a function, the default value will be provided as the first argument.

If you *don't* use a function to define you properties, the module will try to
merge them with the default values. This can be handy for `paths`, `whitelist` and so on because
the defaults are quite sensible. If you don't want to have the defaults include, just use a function.

### Properties in-depth

#### mode

* Type: `String` ('webpack' or 'postcss')
* Default: `postcss`

Defines the mode, PurgeCSS should be used in.

* Webpack mode can only be used with `build.extractCSS: true`
* PostCSS mode can only be used with a `build.postcss` **object** (no array) or default settings

#### enabled

* Type: `Boolean`
* Default: `options.dev === false` (Disabled during `nuxt dev`, enabled otherwise)

Enables/Disables the module

#### PurgeCSS options

Please read [the PurgeCSS docs](https://www.purgecss.com/configuration) for information about
PurgeCSS-related information.

Instead of `content` we use `paths` to specify the paths PurgeCSS should look into (explained [here](https://www.purgecss.com/with-webpack#options).
This applies to **both modes**, not only to `webpack mode`.

## Examples

### Default setup

```js
//nuxt.config.js
export default {
  modules: [
    'nuxt-purgecss',
  ]
}
```

### Override a default value


```js
//nuxt.config.js
export default {
  modules: [
    'nuxt-purgecss',
  ],

  purgeCSS: {
   whitelist: () => ['only-this-class']
  }
}
```

### Append a value to the defaults


```js
//nuxt.config.js
export default {
  modules: [
    'nuxt-purgecss',
  ],

  purgeCSS: {
   whitelist: ['defaults-and-this-class']
  }
}
```

### Override a default value


```js
//nuxt.config.js
export default {
  modules: [
    'nuxt-purgecss',
  ],

  purgeCSS: {
   whitelist: (defaultWhitelst) => defaultWhitelst.slice(1)
  }
}
```

### Use custom extractors
Only one extractor can be applied to each file extention.
If you want to apply a custom extractor to the extensions that the default extractor already covers, you have to override the default extractor. This is only possible with the functional notation.

```js
//nuxt.config.js
export default {
  modules: [
    'nuxt-purgecss',
  ],

  purgeCSS: {
    extractors: () => [
      {
        extractor(content) {
          return content.match(/[A-z0-9-:\\/]+/g)
        },
        extensions: ['html', 'vue', 'js']
      },
      {
        extractor(content) {
          return content.match(/[A-z0-9-\\/]+/g)
        },
        extensions: ['vue'] // This will not work, because the above extractor is applied to 'vue' already.
      }
    ]
  }
}
```

## Migrating from v0.x

1. Review the [**Release Notes**](./CHANGELOG.md) for all changes
2. Bump to 1.x
3. Ensure the plugin is running in the right mode
    * If you used the default mode, you have to add `mode: 'webpack'` to your config.
    * If you used the `postcss` mode, you can remove the `mode: 'postcss'` line from your config
    * If you used this module only with the [Nuxt `tailwind` module](https://github.com/nuxt-community/tailwindcss-module), you don't need to do anything
4. Read about the internal changes of [PurgeCSS 2](https://github.com/fullhuman/purgecss/releases)
5. Update your extractor and change the syntax from a class to a function (see 4.)
6. Unused styles from SFCs are now purged. If you don't want that, whitelist them.
7. The regex for CSS classes changed. This should not be breaking in most cases.
8. The whitelist now includes nuxt link classes (e.g. `nuxt-link-active`). If you whitelisted these before, you can remove them.
9. The whitelist now includes move transition classes. If you whitelisted these before, you can remove them.
10. Test on your staging server (or locally) before deploying!

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

