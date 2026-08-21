# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0-next.1 (2026-08-21)

### Bug Fixes

* **app-shell-vite-plugin:** cross-platform module resolution ([#4760](https://github.com/pentaho/hv-uikit-react/issues/4760)) ([06776ee](https://github.com/pentaho/hv-uikit-react/commit/06776ee5fd9f56132be9e749abafce9ea9c3511a))
* **app-shell-vite-plugin:** missing default export on app-shell-services ([#5183](https://github.com/pentaho/hv-uikit-react/issues/5183)) ([cd0c8cf](https://github.com/pentaho/hv-uikit-react/commit/cd0c8cf1c0c7471bb4bc229fe82024bc100559e0))
* **AppShel:** async config loading ([#5021](https://github.com/pentaho/hv-uikit-react/issues/5021)) ([c4bf006](https://github.com/pentaho/hv-uikit-react/commit/c4bf006391f7cdb535da4c3c01dbe7f4900778f3))
* **AppShell:** improve external marking and id prefix replacement [PPUC-199] ([#4941](https://github.com/pentaho/hv-uikit-react/issues/4941)) ([409b6ff](https://github.com/pentaho/hv-uikit-react/commit/409b6ff34dac7b718db429ec23212dd4f3ca705c))
* **AppShell:** prevent preload of shared external modules ([#5015](https://github.com/pentaho/hv-uikit-react/issues/5015)) ([7c0297e](https://github.com/pentaho/hv-uikit-react/commit/7c0297e2a6637a8c32608f8717a106ba3f1975c5))
* **AppShell:** remove preload of non-existing icons.svg ([#4999](https://github.com/pentaho/hv-uikit-react/issues/4999)) ([22c9f75](https://github.com/pentaho/hv-uikit-react/commit/22c9f75f9ee18d5d9c8f0687ffb4c8228d5f3817))
* **AppShell:** vite plugin dependencies ([#5197](https://github.com/pentaho/hv-uikit-react/issues/5197)) ([b9d4653](https://github.com/pentaho/hv-uikit-react/commit/b9d4653221c57bda94d4267f29cedd577acf59e1))
* **AppShell:** vite plugin windows build ([#4797](https://github.com/pentaho/hv-uikit-react/issues/4797)) ([909ca5f](https://github.com/pentaho/hv-uikit-react/commit/909ca5fa727e8eb4aa7d0c3f7ba7f1c42107dae0))
* **config:** bump oxlint version & config new rules ([#5116](https://github.com/pentaho/hv-uikit-react/issues/5116)) ([2ffa7ba](https://github.com/pentaho/hv-uikit-react/commit/2ffa7bafbe87914a55bc3be27eed36a17253c917))
* **deps:** reduce direct dependencies ([#5173](https://github.com/pentaho/hv-uikit-react/issues/5173)) ([186a11b](https://github.com/pentaho/hv-uikit-react/commit/186a11bd5024bdec89fd5edcc8f3382cbdc4f904))
* prevent preload of external modules ([#5014](https://github.com/pentaho/hv-uikit-react/issues/5014)) ([7adbe36](https://github.com/pentaho/hv-uikit-react/commit/7adbe3613b6bd180984b40ba6e9bca2cb673293a))
* **types:** app-shell-shared types path ([#5017](https://github.com/pentaho/hv-uikit-react/issues/5017)) ([a95db38](https://github.com/pentaho/hv-uikit-react/commit/a95db3877f2fc2a55f49cfb3277ecf6c473e0e77))

### Features

* **app-shell:** add i18next package, i18n resource bundles, translations ([56e79a3](https://github.com/pentaho/hv-uikit-react/commit/56e79a3dc0ea73c4648e0d4e88100404287b3bb0))
* **AppShell:** add client condition configuration [PPUC-34] ([#4988](https://github.com/pentaho/hv-uikit-react/issues/4988)) ([1a4c56e](https://github.com/pentaho/hv-uikit-react/commit/1a4c56e955d87c7afc83117b0975ed7d193fb33c))
* **AppShell:** add Services package to the App Shell suite [PPUC-187] ([#4895](https://github.com/pentaho/hv-uikit-react/issues/4895)) ([80a9f4e](https://github.com/pentaho/hv-uikit-react/commit/80a9f4e5c68be5dd4534eb3926de44f50e569d08))
* **AppShell:** add vite plugin parameter to control importmap normalization [PPUC-199] ([#4932](https://github.com/pentaho/hv-uikit-react/issues/4932)) ([95b7608](https://github.com/pentaho/hv-uikit-react/commit/95b7608a9289d380b5a5155a25e86d515d881b41))
* **AppShell:** enhance dependency handling for externalized packages [PPUC-727] ([#5199](https://github.com/pentaho/hv-uikit-react/issues/5199)) ([aa457b9](https://github.com/pentaho/hv-uikit-react/commit/aa457b9cf41bb97030a9ee56bef5f9fae19f7cbd))
* **AppShell:** generate dist artifacts for new packaging layout [PPUC-727] ([#5172](https://github.com/pentaho/hv-uikit-react/issues/5172)) ([54693a8](https://github.com/pentaho/hv-uikit-react/commit/54693a83712a4dd3c027ba1b927a68537ce4e977))
* **AppShell:** migrate packages ([#4631](https://github.com/pentaho/hv-uikit-react/issues/4631)) ([5601708](https://github.com/pentaho/hv-uikit-react/commit/560170844dcc962308a6945f40a9e7c13e131a39))
* **config:** add oxlint configuration ([#4785](https://github.com/pentaho/hv-uikit-react/issues/4785)) ([fa8f919](https://github.com/pentaho/hv-uikit-react/commit/fa8f9194ccdfd04732ca6986a5ea13bff7592933))
* explicit supported-locales.json file filters translations [PPUC-512] ([#5163](https://github.com/pentaho/hv-uikit-react/issues/5163)) ([eb34327](https://github.com/pentaho/hv-uikit-react/commit/eb343275a144a3684001b08609529e315d0c280a))
* migrate package names ([#5228](https://github.com/pentaho/hv-uikit-react/issues/5228)) ([d10c64c](https://github.com/pentaho/hv-uikit-react/commit/d10c64c62ade51dadb115bffa1894d13c44a4a91))

### Reverts

* Revert "chore(release): publish" (#4969) ([c3e10b0](https://github.com/pentaho/hv-uikit-react/commit/c3e10b015cdd1b36183c8a733d604a238f0d298c)), closes [#4969](https://github.com/pentaho/hv-uikit-react/issues/4969)
* "chore(release): publish" ([#4972](https://github.com/pentaho/hv-uikit-react/issues/4972)) ([fd92a30](https://github.com/pentaho/hv-uikit-react/commit/fd92a30f57c51d41ee3dce9c4920a15f16abb59a))
* "chore(release): publish" ([#4980](https://github.com/pentaho/hv-uikit-react/issues/4980)) ([85a3567](https://github.com/pentaho/hv-uikit-react/commit/85a35679d698bc6e05e1cd7b26739badccdc3fe1))
* "chore(release): publish" ([#5146](https://github.com/pentaho/hv-uikit-react/issues/5146)) ([bf1eae6](https://github.com/pentaho/hv-uikit-react/commit/bf1eae62b70bbdc0bb85dd8ee840ed2f47c33cc8))
