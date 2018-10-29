# Nuxt PurgeCSS - Drop superfluous CSS!
[![npm (scoped with tag)](https://img.shields.io/npm/v/nuxt-purgecss/latest.svg?style=flat-square)](https://npmjs.com/package/nuxt-purgecss)
[![npm](https://img.shields.io/npm/dt/nuxt-purgecss.svg?style=flat-square)](https://npmjs.com/package/nuxt-purgecss)
[![Build Status](https://travis-ci.com/Developmint/nuxt-purgecss.svg?branch=master)](https://travis-ci.com/Developmint/nuxt-purgecss)
[![codecov](https://codecov.io/gh/Developmint/nuxt-purgecss/branch/master/graph/badge.svg)](https://codecov.io/gh/Developmint/nuxt-purgecss)
[![Dependencies](https://david-dm.org/Developmint/nuxt-purgecss/status.svg?style=flat-square)](https://david-dm.org/Developmint/nuxt-purgecss)
[![js-standard-style](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)
[![thanks](https://img.shields.io/badge/thanks-%E2%99%A5-ff69b4.svg)](https://thanks.lichter.io/)

>

[📖 **Release Notes**](./CHANGELOG.md)

## Features

* Remove unneeded CSS with ease
* Webpack or PostCSS mode
* Already comes with mighty default settings
* Built on top of [purgecss](https://github.com/FullHuman/purgecss)
* Nuxt 2 (and only Nuxt 2) support
* Fully tested!

## Setup

- Add `nuxt-purgecss` dependency using yarn or npm to your project
- Add `nuxt-purgecss` to `modules` section of `nuxt.config.js`:

```js
{
  modules: [
    'nuxt-purgecss',
  ],

  purgeCSS: {
   // your settings here
  }
}
```

## Options

### Defaults

Before diving into the individual attributes, here are the default settings of the module:

```js
{
  mode: MODES.webpack,
  enabled: ({ isDev, isClient }) => (!isDev && isClient), // or `false` when in dev/debug mode
  paths: [
    'components/**/*.vue',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'plugins/**/*.js'
  ],
  styleExtensions: ['.css'],
  whitelist: ['body', 'html', 'nuxt-progress'],
  extractors: [
    {
      extractor: class {
        static extract(content) {
          return content.match(/[A-z0-9-:\\/]+/g)
        }
      },
      extensions: ['html', 'vue', 'js']
    }
  ]
}
```

This settings should be a good foundation for a variety of projects.

### Merging defaults

You can define every option either as function or as static value (primitives, objects, arrays, ...).
if you use a function, the default value will be provided as the first argument.

If you *don't* use a function to define you properties, the module will try to
merge them with the default values. This can be handy for `paths`, `whitelist` and so on because
the defaults are quite sensible. If you don't want to have the defaults include, just use a function.

### Properties in-depth

#### mode

* Type: `String` (webpack or postcss)
* Default: `webpack`

Defines the mode, PurgeCSS should be used in.

* Webpack mode can only be used with `build.extractCSS: true`
* PostCSS mode can only be used with a `build.postcss` **object** (no array) or default settings

#### enabled

* Type: `Boolean` or `Function` (only for webpack mode, will receive the build.extend ctx)
* Default: `({ isDev, isClient }) => (!isDev && isClient)` (only activates in production mode) or `false` in debug/dev mode

Enables/Disables the module

* If it evaluates to false, the module won't be activated at all
* If a function is given, it'll be properly evaluated in webpack mode (in postcss mode it'll be handled as true)


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


## Development

- Clone this repository
- Install dependencies using `yarn install` or `npm install`
- Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Alexander Lichter
