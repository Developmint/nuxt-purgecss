# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/Developmint/nuxt-purgecss/compare/v0.2.1...v2.0.0) (2020-04-26)

## Breaking changes

* `postcss` mode is the default mode (previously `webpack`)
* Updated to PurgeCSS 2 and the new extractor syntax (fn instead of class)
* Unused styles inside SFCs are purged properly 
* Enabling the module now depends on the mode by default
	* When in `nuxt dev`, it is disabled
	* Purging is enabled otherwise

## Features

* add nuxt.config.js to paths to purge classes used there ([3dba75e](https://github.com/Developmint/nuxt-purgecss/commit/3dba75e77a4f268f8a2136aed2ce95ee086b962e))
* use official regex and support tailwind ui ([#79](https://github.com/Developmint/nuxt-purgecss/issues/79)) ([ba13564](https://github.com/Developmint/nuxt-purgecss/commit/ba1356439a1f0411d24f5123522b93856407b727))


### Bug Fixes

* **scoped-css:** whitelist data-v-* attributes ([#75](https://github.com/Developmint/nuxt-purgecss/issues/75)) ([f9942de](https://github.com/Developmint/nuxt-purgecss/commit/f9942deab848eb23c588616e51c7560e341a2731))
* add `__nuxt` & `__layout` to whitelist ([#36](https://github.com/Developmint/nuxt-purgecss/issues/36)) ([d1fbe53](https://github.com/Developmint/nuxt-purgecss/commit/d1fbe5369310f8611f11131a46b3c3df91b22925))
* do not purge vue transition css classes ([#59](https://github.com/Developmint/nuxt-purgecss/issues/59)) ([5dd0972](https://github.com/Developmint/nuxt-purgecss/commit/5dd097259e213504a958d58ef73f43e87c32e68d))


## Internal improvements

* Improved README (fixes https://github.com/Developmint/nuxt-purgecss/issues/62)
* Revamped tests and utilized https://github.com/nuxt-community/module-test-utils/
* GitHub actions are used as CI now



<a name="0.2.1"></a>
## [0.2.1](https://github.com/Developmint/nuxt-purgecss/compare/v0.2.0...v0.2.1) (2019-01-21)


### Bug Fixes

* add empty whitelistPatterns and whitelistPatternsChildren ([#30](https://github.com/Developmint/nuxt-purgecss/issues/30)) ([f17667d](https://github.com/Developmint/nuxt-purgecss/commit/f17667d))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/Developmint/nuxt-purgecss/compare/v0.1.0...v0.2.0) (2018-12-19)


### Features

* info log when module is disabled by default (in dev mode) ([6996641](https://github.com/Developmint/nuxt-purgecss/commit/6996641)), closes [#23](https://github.com/Developmint/nuxt-purgecss/issues/23)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/Developmint/nuxt-purgecss/compare/v0.0.2...v0.1.0) (2018-12-19)


### Bug Fixes

* return empty array if extractor doesn't match ([c847c34](https://github.com/Developmint/nuxt-purgecss/commit/c847c34))


### Features

* accept module options ([c15f876](https://github.com/Developmint/nuxt-purgecss/commit/c15f876)), closes [#21](https://github.com/Developmint/nuxt-purgecss/issues/21)



<a name="0.0.2"></a>
## [0.0.2](https://github.com/Developmint/nuxt-purgecss/compare/v0.0.1...v0.0.2) (2018-10-24)


### Bug Fixes

* superfluous error message in dev mode ([#4](https://github.com/Developmint/nuxt-purgecss/issues/4)) ([cb38a65](https://github.com/Developmint/nuxt-purgecss/commit/cb38a65))



<a name="0.0.1"></a>
## 0.0.1 (2018-10-21)
