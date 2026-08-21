# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 7.0.0-next.1 (2026-08-21)

### Bug Fixes

* **BaseChart:** allow for dynamic height on the BaseChart ([6c4c853](https://github.com/pentaho/hv-uikit-react/commit/6c4c853734bc2c12c251ace65931c8d046320002))
* **BaseChart:** chart width and height ([82ca485](https://github.com/pentaho/hv-uikit-react/commit/82ca4856d370fa2bb49cbed67f316dbc8967ee0a))
* **boxplot:** omit unused properties ([c5a62ac](https://github.com/pentaho/hv-uikit-react/commit/c5a62ac6e805a2f633e5db55b27880e33933b596))
* build not working on windows ([47ce45d](https://github.com/pentaho/hv-uikit-react/commit/47ce45d0cddb2328141223badabaebf755093fce))
* **chart:** fix custom tooltips ts definition. MLAAS-1523 ([#2927](https://github.com/pentaho/hv-uikit-react/issues/2927)) ([4ea6e5d](https://github.com/pentaho/hv-uikit-react/commit/4ea6e5d7d4f9fafed9a530052e686f6b5a92e9c4))
* **config:** bump oxlint version & config new rules ([#5116](https://github.com/pentaho/hv-uikit-react/issues/5116)) ([2ffa7ba](https://github.com/pentaho/hv-uikit-react/commit/2ffa7bafbe87914a55bc3be27eed36a17253c917))
* ensure the charts change when the theme changes ([e061589](https://github.com/pentaho/hv-uikit-react/commit/e0615896bf9151a4eb8fec578f8c30eabd0e4b8d))
* filter chart data before any data manipulation ([baacc98](https://github.com/pentaho/hv-uikit-react/commit/baacc98150b90a008d01af5ab1af5828efc6fc5c))
* ignore filter if field is not present in the data set ([dc9b372](https://github.com/pentaho/hv-uikit-react/commit/dc9b372a7bf0ac20267b74cfab026e84f04fd6b3))
* missing filters logic added to boxplot ([f9ad44d](https://github.com/pentaho/hv-uikit-react/commit/f9ad44d7534904086b7f6de150467d4704cc499e))
* normalize viz columns name ([1b550ca](https://github.com/pentaho/hv-uikit-react/commit/1b550ca3effac824b6c5d40468b59ca69fc1212a))
* reset chart horizontalRangeSlider ([9c483f1](https://github.com/pentaho/hv-uikit-react/commit/9c483f1ab4c00da558e5e8e6ced17e668fcc801f))
* same measure field with different agg function not overridden ([57be449](https://github.com/pentaho/hv-uikit-react/commit/57be44995ba9d82bf1682d71831dba67d476895f))
* **table:** types need to be included in the package ([e4c1071](https://github.com/pentaho/hv-uikit-react/commit/e4c107157080fbd1cb82a88b4a96ce0fc61ee3a9))
* **theme:** deprecate old `base_light`/`base_dark` colors ([#4864](https://github.com/pentaho/hv-uikit-react/issues/4864)) ([f675f61](https://github.com/pentaho/hv-uikit-react/commit/f675f611e4b10d2112c932ccbcf4de42123706ef))
* **treemap:** remove unneeded title ([9fa3a49](https://github.com/pentaho/hv-uikit-react/commit/9fa3a49a7ee088f813eb2d5f832c43fc3dcb03a2))
* **types:** add exports types declaration ([#4280](https://github.com/pentaho/hv-uikit-react/issues/4280)) ([da844fc](https://github.com/pentaho/hv-uikit-react/commit/da844fc7a8d6a6ce2e2893e80887f3c5d795d376))
* **types:** app-shell-shared types path ([#5017](https://github.com/pentaho/hv-uikit-react/issues/5017)) ([a95db38](https://github.com/pentaho/hv-uikit-react/commit/a95db3877f2fc2a55f49cfb3277ecf6c473e0e77))
* values converted to string for contains and notContains filters ([dcf037c](https://github.com/pentaho/hv-uikit-react/commit/dcf037c279e5b392c376da53697125ecdc3db521))
* viz legend position ([1deb1b2](https://github.com/pentaho/hv-uikit-react/commit/1deb1b280ad286a0c507c86f5359dd34c3952d4f))
* **viz:** echarts-for-react imports ([#5110](https://github.com/pentaho/hv-uikit-react/issues/5110)) ([94d56fe](https://github.com/pentaho/hv-uikit-react/commit/94d56feee33df4cf63fc5c5e55bd5dc6a0d6a3fe))
* **VizProvider:** fallback to default theme ([6bb06b0](https://github.com/pentaho/hv-uikit-react/commit/6bb06b0bedb90e41142f0e096bf0323177f61cff))

### Features

* add Boxplot viz ([26dcd90](https://github.com/pentaho/hv-uikit-react/commit/26dcd90fb815df7161bf3f3a5a1f8636c0b5964f))
* add filtering capabilities to the visualizations ([af4ae8c](https://github.com/pentaho/hv-uikit-react/commit/af4ae8cdc553a84f4cd214429efe103761e5920c))
* add Heatmap viz ([99c2a7a](https://github.com/pentaho/hv-uikit-react/commit/99c2a7a603fca51aafaa90c012d8026a29720aa1))
* add Treemap viz ([f92a418](https://github.com/pentaho/hv-uikit-react/commit/f92a4181cf80be35c96562a0c407491c605d5b54))
* adding new peer dependencies ([4a741fd](https://github.com/pentaho/hv-uikit-react/commit/4a741fdc39eb37a19ecd306ff7837778293df898))
* **BarChart:** bar chart added ([4b81d32](https://github.com/pentaho/hv-uikit-react/commit/4b81d32ed1ed27b386e765ebb481f1eb89212a84))
* **BarChart:** review and custom tooltip added ([63b29c0](https://github.com/pentaho/hv-uikit-react/commit/63b29c07b7b70721a59f54a04bd597b25fe5ca6a))
* **chart:** add custom tooltips to charts. MLAAS-1523 ([#2918](https://github.com/pentaho/hv-uikit-react/issues/2918)) ([9fedb13](https://github.com/pentaho/hv-uikit-react/commit/9fedb1393031d5c40207b0f874d755733edc5f2d))
* **config:** add oxlint configuration ([#4785](https://github.com/pentaho/hv-uikit-react/issues/4785)) ([fa8f919](https://github.com/pentaho/hv-uikit-react/commit/fa8f9194ccdfd04732ca6986a5ea13bff7592933))
* **ConfusionMatrix:** confusion matrix added ([cbf1263](https://github.com/pentaho/hv-uikit-react/commit/cbf1263b1fd737b434d3fab0ce80ab0ac4e68efb))
* **DonutChart:** add donut chart ([030d7ee](https://github.com/pentaho/hv-uikit-react/commit/030d7ee61c0494a84aa806f5dbd5500f7f178a48))
* **Dropdown:** allow generic values and onChange ([#4363](https://github.com/pentaho/hv-uikit-react/issues/4363)) ([00f4b38](https://github.com/pentaho/hv-uikit-react/commit/00f4b38314edb0b77e6960fc9ea606e09a2333f6))
* getHvArqueroCombinedFilters exported to users ([a2dce44](https://github.com/pentaho/hv-uikit-react/commit/a2dce44bc743e30d45bc695399b36ae9e48c96b4))
* migrate package names ([#5228](https://github.com/pentaho/hv-uikit-react/issues/5228)) ([d10c64c](https://github.com/pentaho/hv-uikit-react/commit/d10c64c62ade51dadb115bffa1894d13c44a4a91))
* new agg functions added to viz ([a427376](https://github.com/pentaho/hv-uikit-react/commit/a427376dfb9aca0a49a53833f42f3189dd156ebe))
* new filters added to visualizations ([78f7ae1](https://github.com/pentaho/hv-uikit-react/commit/78f7ae1c0d728ce782435de4b79fcc88873cec86))
* onEvents callback added to viz ([083f398](https://github.com/pentaho/hv-uikit-react/commit/083f39833c02545ac1039315ca3fef18d70b2853))
* replace provider baseline ([e2d1a79](https://github.com/pentaho/hv-uikit-react/commit/e2d1a79e953ccfd85beb68674e3ef53d07e630ba))
* scatter plot added ([#4139](https://github.com/pentaho/hv-uikit-react/issues/4139)) ([3a29e6a](https://github.com/pentaho/hv-uikit-react/commit/3a29e6a358b51aa06adde907c229d463ceb56b24))
* **theme:** add `colors` helper to `useTheme` ([09b829b](https://github.com/pentaho/hv-uikit-react/commit/09b829b28d303e4cbb4d0fcd5598a3997a159374))
* **theme:** support only light/dark color modes ([#4857](https://github.com/pentaho/hv-uikit-react/issues/4857)) ([83973d2](https://github.com/pentaho/hv-uikit-react/commit/83973d2bc54e5eb71a7923035b789016d36b9456))
* **utils:** add `@hitachivantara/uikit-react-utils` package ([#4273](https://github.com/pentaho/hv-uikit-react/issues/4273)) ([2a271a2](https://github.com/pentaho/hv-uikit-react/commit/2a271a2e4385fe3ca48fd419d1651b54f26381b8))
* **visualisations:** create new viz package. HVUIKIT-6390 ([#2835](https://github.com/pentaho/hv-uikit-react/issues/2835)) ([cc901df](https://github.com/pentaho/hv-uikit-react/commit/cc901dff23857b157e18dc46892061602f3f1767))
* viz legend position and direction ([5db998e](https://github.com/pentaho/hv-uikit-react/commit/5db998e21a431575f4af405c380fa09f2823e61f))
* **viz:** customize echarts option ([aca13ae](https://github.com/pentaho/hv-uikit-react/commit/aca13ae8874c0f88cd05c970fe5697c7aee0c772))
* **Viz:** viz provider and line chart added ([#3376](https://github.com/pentaho/hv-uikit-react/issues/3376)) ([18f67cc](https://github.com/pentaho/hv-uikit-react/commit/18f67ccd0a8376c706ee1c478032cd046177a7f1))

### Performance Improvements

* remove core dependency in viz & code-editor ([27ede92](https://github.com/pentaho/hv-uikit-react/commit/27ede92f7e198924655247cb576867c027286c3d))

### Reverts

* Revert "chore(release): publish" (#4969) ([c3e10b0](https://github.com/pentaho/hv-uikit-react/commit/c3e10b015cdd1b36183c8a733d604a238f0d298c)), closes [#4969](https://github.com/pentaho/hv-uikit-react/issues/4969)
* Revert "chore(release): publish" ([f507bec](https://github.com/pentaho/hv-uikit-react/commit/f507becd237290280f3362427fc658df6c37cd64))
* Revert "chore(release): publish" ([0261483](https://github.com/pentaho/hv-uikit-react/commit/0261483ff517270d18a47caf4c0982910f594fda))
* Revert "chore(release): publish" (#4369) ([6f16a6d](https://github.com/pentaho/hv-uikit-react/commit/6f16a6dbde951a4dd1b32a08e9a26c71295600f1)), closes [#4369](https://github.com/pentaho/hv-uikit-react/issues/4369)
* Revert "chore(release): publish" ([c4fae1b](https://github.com/pentaho/hv-uikit-react/commit/c4fae1bf354a0f3c7f3db4f1b16d520380f0f85f))
* Revert "chore(release): publish" ([ecea29c](https://github.com/pentaho/hv-uikit-react/commit/ecea29c4ea42586e3c4f828492c7afecf375419e))
* Revert "chore(release): publish" ([02f40a7](https://github.com/pentaho/hv-uikit-react/commit/02f40a7f45252dd3c4c9781f30c674cb21a8f3c6))
* Revert "chore(release): publish" ([dd13624](https://github.com/pentaho/hv-uikit-react/commit/dd13624834dbd9d33745201829c137fe39a3f19c))
* "chore(release): publish" ([a580a01](https://github.com/pentaho/hv-uikit-react/commit/a580a0110faa7a2bc047bfa39d53ff2ddffba4bc))
* "chore(release): publish" ([#4972](https://github.com/pentaho/hv-uikit-react/issues/4972)) ([fd92a30](https://github.com/pentaho/hv-uikit-react/commit/fd92a30f57c51d41ee3dce9c4920a15f16abb59a))
* "chore(release): publish" ([#4980](https://github.com/pentaho/hv-uikit-react/issues/4980)) ([85a3567](https://github.com/pentaho/hv-uikit-react/commit/85a35679d698bc6e05e1cd7b26739badccdc3fe1))
