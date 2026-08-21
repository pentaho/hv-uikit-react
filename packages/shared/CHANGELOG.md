# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 7.0.0-next.1 (2026-08-21)

### Bug Fixes

* aliases for core package ([0fe50ac](https://github.com/pentaho/hv-uikit-react/commit/0fe50ac9cb7fb6c33a0f8f33cd6dab4ebdcefc45))
* aliases for shared package ([a9e2f07](https://github.com/pentaho/hv-uikit-react/commit/a9e2f07e4315fd5641495a4482ca0378cad8afe0))
* **config:** bump oxlint version & config new rules ([#5116](https://github.com/pentaho/hv-uikit-react/issues/5116)) ([2ffa7ba](https://github.com/pentaho/hv-uikit-react/commit/2ffa7bafbe87914a55bc3be27eed36a17253c917))
* **deps:** reduce direct dependencies ([#5173](https://github.com/pentaho/hv-uikit-react/issues/5173)) ([186a11b](https://github.com/pentaho/hv-uikit-react/commit/186a11bd5024bdec89fd5edcc8f3382cbdc4f904))
* restore shared package esm bundle ([63962ea](https://github.com/pentaho/hv-uikit-react/commit/63962eac5223022dce3c6472df891c090b6cf26a))
* **shared:** keep ThemeContext backwards-compatible ([#5019](https://github.com/pentaho/hv-uikit-react/issues/5019)) ([4078409](https://github.com/pentaho/hv-uikit-react/commit/407840961ec76718a90a3d421c46a09488d58765))
* **theme:** remove v5 compat theme extensions ([#5229](https://github.com/pentaho/hv-uikit-react/issues/5229)) ([aa8b808](https://github.com/pentaho/hv-uikit-react/commit/aa8b808544f94b08d5b78a4013477ff4f7e48c91))
* **types:** add exports types declaration ([#4280](https://github.com/pentaho/hv-uikit-react/issues/4280)) ([da844fc](https://github.com/pentaho/hv-uikit-react/commit/da844fc7a8d6a6ce2e2893e80887f3c5d795d376))
* **types:** app-shell-shared types path ([#5017](https://github.com/pentaho/hv-uikit-react/issues/5017)) ([a95db38](https://github.com/pentaho/hv-uikit-react/commit/a95db3877f2fc2a55f49cfb3277ecf6c473e0e77))

### Features

* **AppShell:** migrate packages ([#4631](https://github.com/pentaho/hv-uikit-react/issues/4631)) ([5601708](https://github.com/pentaho/hv-uikit-react/commit/560170844dcc962308a6945f40a9e7c13e131a39))
* class names key added to provider ([e03b46f](https://github.com/pentaho/hv-uikit-react/commit/e03b46f06435b96f85ca1117e6290efd12f163a7))
* **config:** add oxlint configuration ([#4785](https://github.com/pentaho/hv-uikit-react/issues/4785)) ([fa8f919](https://github.com/pentaho/hv-uikit-react/commit/fa8f9194ccdfd04732ca6986a5ea13bff7592933))
* emotion cache accessible via shared package context ([#3520](https://github.com/pentaho/hv-uikit-react/issues/3520)) ([e4a7d4f](https://github.com/pentaho/hv-uikit-react/commit/e4a7d4f1c0556683d50afb8e53b74a5fb7239bb7))
* migrate package names ([#5228](https://github.com/pentaho/hv-uikit-react/issues/5228)) ([d10c64c](https://github.com/pentaho/hv-uikit-react/commit/d10c64c62ade51dadb115bffa1894d13c44a4a91))
* package providing shared React context ([b07f87a](https://github.com/pentaho/hv-uikit-react/commit/b07f87a41ed07d1a5babd07aa309cd659ab11208))
* scoped css baseline ([7b93bc5](https://github.com/pentaho/hv-uikit-react/commit/7b93bc55375dd1d8ed97281ce6afa8233bb9095c))
* **shared:** add useTheme & classes utils ([c4a3828](https://github.com/pentaho/hv-uikit-react/commit/c4a38283466f691ee64b1218b43b8ad5bc8a3506))
* **theme:** support only light/dark color modes ([#4857](https://github.com/pentaho/hv-uikit-react/issues/4857)) ([83973d2](https://github.com/pentaho/hv-uikit-react/commit/83973d2bc54e5eb71a7923035b789016d36b9456))
* **utils:** add `@hitachivantara/uikit-react-utils` package ([#4273](https://github.com/pentaho/hv-uikit-react/issues/4273)) ([2a271a2](https://github.com/pentaho/hv-uikit-react/commit/2a271a2e4385fe3ca48fd419d1651b54f26381b8))

### Performance Improvements

* remove core dependency in viz & code-editor ([27ede92](https://github.com/pentaho/hv-uikit-react/commit/27ede92f7e198924655247cb576867c027286c3d))

### Reverts

* Revert "chore(release): publish" (#4969) ([c3e10b0](https://github.com/pentaho/hv-uikit-react/commit/c3e10b015cdd1b36183c8a733d604a238f0d298c)), closes [#4969](https://github.com/pentaho/hv-uikit-react/issues/4969)
* Revert "chore(release): publish" ([f507bec](https://github.com/pentaho/hv-uikit-react/commit/f507becd237290280f3362427fc658df6c37cd64))
* Revert "chore(release): publish" ([0261483](https://github.com/pentaho/hv-uikit-react/commit/0261483ff517270d18a47caf4c0982910f594fda))
* Revert "chore(release): publish" (#4369) ([6f16a6d](https://github.com/pentaho/hv-uikit-react/commit/6f16a6dbde951a4dd1b32a08e9a26c71295600f1)), closes [#4369](https://github.com/pentaho/hv-uikit-react/issues/4369)
* Revert "chore(release): publish" ([c4fae1b](https://github.com/pentaho/hv-uikit-react/commit/c4fae1bf354a0f3c7f3db4f1b16d520380f0f85f))
* Revert "chore(release): publish" ([ecea29c](https://github.com/pentaho/hv-uikit-react/commit/ecea29c4ea42586e3c4f828492c7afecf375419e))
* Revert "chore(release): publish" ([dd13624](https://github.com/pentaho/hv-uikit-react/commit/dd13624834dbd9d33745201829c137fe39a3f19c))
* "chore(release): publish" ([a580a01](https://github.com/pentaho/hv-uikit-react/commit/a580a0110faa7a2bc047bfa39d53ff2ddffba4bc))
* "chore(release): publish" ([#4972](https://github.com/pentaho/hv-uikit-react/issues/4972)) ([fd92a30](https://github.com/pentaho/hv-uikit-react/commit/fd92a30f57c51d41ee3dce9c4920a15f16abb59a))
* "chore(release): publish" ([#4980](https://github.com/pentaho/hv-uikit-react/issues/4980)) ([85a3567](https://github.com/pentaho/hv-uikit-react/commit/85a35679d698bc6e05e1cd7b26739badccdc3fe1))
