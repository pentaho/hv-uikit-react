# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 7.0.0-next.1 (2026-08-21)

### Bug Fixes

* **a11y:** ensure role on tooltip'ed elements & use strings on labels ([#3974](https://github.com/pentaho/hv-uikit-react/issues/3974)) ([edf0730](https://github.com/pentaho/hv-uikit-react/commit/edf0730f54974c58f9f23c2e6375dbb2b8ebe60d))
* build not working on windows ([47ce45d](https://github.com/pentaho/hv-uikit-react/commit/47ce45d0cddb2328141223badabaebf755093fce))
* **code-editor:** downgrade monaco-editor to v0.52.2 ([#4956](https://github.com/pentaho/hv-uikit-react/issues/4956)) ([aaed674](https://github.com/pentaho/hv-uikit-react/commit/aaed674ca33947e96730a469e602358cb93786e4))
* **code-editor:** fix header spacing ([d79dbe6](https://github.com/pentaho/hv-uikit-react/commit/d79dbe6fe4637c357f31c5c2dd9d8c455cac5a37))
* **code-editor:** import component not working ([8919a85](https://github.com/pentaho/hv-uikit-react/commit/8919a850912239ec64d0e65722b7759b72158ea5))
* **code-editor:** restore window.MonacoEnvironment assignment ([#4958](https://github.com/pentaho/hv-uikit-react/issues/4958)) ([9fd6ca4](https://github.com/pentaho/hv-uikit-react/commit/9fd6ca43c298f0b0684a85383cf1dcfa0283d50b))
* **CodeEditor:** account for special characters inside tables and columns names ([#4493](https://github.com/pentaho/hv-uikit-react/issues/4493)) ([6c79b50](https://github.com/pentaho/hv-uikit-react/commit/6c79b5084c831a68c83dd667adb2e6a3fb9f4f80))
* **CodeEditor:** get text until cursor and not all text in SQL autocomplete ([#4490](https://github.com/pentaho/hv-uikit-react/issues/4490)) ([a6dd752](https://github.com/pentaho/hv-uikit-react/commit/a6dd752f48f6d86922b7ac4593b35b0c1e4c787c))
* **CodeEditor:** make sql suggestions case insensitive and show columns with when keyword ([#4498](https://github.com/pentaho/hv-uikit-react/issues/4498)) ([d13996c](https://github.com/pentaho/hv-uikit-react/commit/d13996cbcd8f97119889b741858ff2adda9eae28))
* **CodeEditor:** not autoclosing tag if attributes are opened ([#4381](https://github.com/pentaho/hv-uikit-react/issues/4381)) ([1a4eeb6](https://github.com/pentaho/hv-uikit-react/commit/1a4eeb6b846b12c2a12634685097d33615093203))
* **CodeEditor:** xml autocomplete not closing selfclosing tag ([#4368](https://github.com/pentaho/hv-uikit-react/issues/4368)) ([cd959a8](https://github.com/pentaho/hv-uikit-react/commit/cd959a8ffe0b46bc8fe2c690266228e6c5280b2a))
* **config:** bump oxlint version & config new rules ([#5116](https://github.com/pentaho/hv-uikit-react/issues/5116)) ([2ffa7ba](https://github.com/pentaho/hv-uikit-react/commit/2ffa7bafbe87914a55bc3be27eed36a17253c917))
* **docs:** broken links ([72f072b](https://github.com/pentaho/hv-uikit-react/commit/72f072b541efc16519183ec4d42e51563de74a9e))
* **linting:** enable airbnb base rules & fix findings ([324805f](https://github.com/pentaho/hv-uikit-react/commit/324805fcd50a33a534b2c04e92ad95b9e108d047))
* **types:** add exports types declaration ([#4280](https://github.com/pentaho/hv-uikit-react/issues/4280)) ([da844fc](https://github.com/pentaho/hv-uikit-react/commit/da844fc7a8d6a6ce2e2893e80887f3c5d795d376))
* **types:** app-shell-shared types path ([#5017](https://github.com/pentaho/hv-uikit-react/issues/5017)) ([a95db38](https://github.com/pentaho/hv-uikit-react/commit/a95db3877f2fc2a55f49cfb3277ecf6c473e0e77))
* updated material-ui to 4.12.3 ([2649c1e](https://github.com/pentaho/hv-uikit-react/commit/2649c1ea9d2fddacc5cf247465ae05d7aebef87b))

### Features

* adding new peer dependencies ([4a741fd](https://github.com/pentaho/hv-uikit-react/commit/4a741fdc39eb37a19ecd306ff7837778293df898))
* **code-editor:** move monaco-editor to peerDependencies ([#4938](https://github.com/pentaho/hv-uikit-react/issues/4938)) ([7ddce66](https://github.com/pentaho/hv-uikit-react/commit/7ddce669469bd0bdb681ed800fb203b55f4a835a))
* **code-editor:** promote component to main. HVUIKIT-5614 ([8241838](https://github.com/pentaho/hv-uikit-react/commit/82418381ef97b3911db355daea015df8c23114d9))
* **CodeEditor:** add CodeEditor component and package ([44e2265](https://github.com/pentaho/hv-uikit-react/commit/44e2265bfe87a595dd0796bad38623ea2e908b5a))
* **CodeEditor:** add Monaco Editor offline support with bundled workers ([#4936](https://github.com/pentaho/hv-uikit-react/issues/4936)) ([b676e36](https://github.com/pentaho/hv-uikit-react/commit/b676e361f552e4bf858585e83b00d00134a7fac2))
* **CodeEditor:** add SQL support ([#4353](https://github.com/pentaho/hv-uikit-react/issues/4353)) ([377c0e8](https://github.com/pentaho/hv-uikit-react/commit/377c0e81b4a8ce697c96617f223ff4a509fa6807))
* **CodeEditor:** add table to column in SQL autocomplete ([#4491](https://github.com/pentaho/hv-uikit-react/issues/4491)) ([323f127](https://github.com/pentaho/hv-uikit-react/commit/323f1278ecdad891a01c5ce483a8776551254311))
* **CodeEditor:** export xml plugin and enable override ([#4351](https://github.com/pentaho/hv-uikit-react/issues/4351)) ([392aaac](https://github.com/pentaho/hv-uikit-react/commit/392aaac30593b2f2df913fd8f6ca5c0cf2b4e400))
* **CodeEditor:** intellisense support for xml ([b8dd9d4](https://github.com/pentaho/hv-uikit-react/commit/b8dd9d4c1a656fa4e162f53a7e42d9b94bd4e382))
* **CodeEditor:** xml code formatter ([#4344](https://github.com/pentaho/hv-uikit-react/issues/4344)) ([569c79e](https://github.com/pentaho/hv-uikit-react/commit/569c79e6bc9690c541cf712dc0f71ac01faa0dbb))
* **config:** add oxlint configuration ([#4785](https://github.com/pentaho/hv-uikit-react/issues/4785)) ([fa8f919](https://github.com/pentaho/hv-uikit-react/commit/fa8f9194ccdfd04732ca6986a5ea13bff7592933))
* **dropdown:** responsive dropdown. HVUIKIT-5710 ([5520904](https://github.com/pentaho/hv-uikit-react/commit/552090454e3f1f564ed30c880c9926f096f25e6c))
* export xml code formatter and optional auto format ([#4350](https://github.com/pentaho/hv-uikit-react/issues/4350)) ([93f7352](https://github.com/pentaho/hv-uikit-react/commit/93f735283ddd6f89f2a6bccf4c2e6d63d2d4f38b))
* improve suggestions and parsing for XML code editor ([#4340](https://github.com/pentaho/hv-uikit-react/issues/4340)) ([9a6ba55](https://github.com/pentaho/hv-uikit-react/commit/9a6ba55e35ccdc3b79b9e80243bd15c4eb74bb32))
* migrate package names ([#5228](https://github.com/pentaho/hv-uikit-react/issues/5228)) ([d10c64c](https://github.com/pentaho/hv-uikit-react/commit/d10c64c62ade51dadb115bffa1894d13c44a4a91))
* minor dependencies updates ([09c4766](https://github.com/pentaho/hv-uikit-react/commit/09c47665940c6bef70eb57fe86ec79931c592585))
* **ScrollTo:** add ScrollTo components ([f24f3ac](https://github.com/pentaho/hv-uikit-react/commit/f24f3ac8e9c32ed38653704aafc7a0a8ee5e70c7))
* upgrade dependencies ([23ee616](https://github.com/pentaho/hv-uikit-react/commit/23ee6167429605bbce7f70e93412b9dd28f5195f))
* **utils:** add `@hitachivantara/uikit-react-utils` package ([#4273](https://github.com/pentaho/hv-uikit-react/issues/4273)) ([2a271a2](https://github.com/pentaho/hv-uikit-react/commit/2a271a2e4385fe3ca48fd419d1651b54f26381b8))
* **visualisations:** create new viz package. HVUIKIT-6390 ([#2835](https://github.com/pentaho/hv-uikit-react/issues/2835)) ([cc901df](https://github.com/pentaho/hv-uikit-react/commit/cc901dff23857b157e18dc46892061602f3f1767))

### Performance Improvements

* remove core dependency in viz & code-editor ([27ede92](https://github.com/pentaho/hv-uikit-react/commit/27ede92f7e198924655247cb576867c027286c3d))

### Reverts

* Revert "chore(release): publish" (#4969) ([c3e10b0](https://github.com/pentaho/hv-uikit-react/commit/c3e10b015cdd1b36183c8a733d604a238f0d298c)), closes [#4969](https://github.com/pentaho/hv-uikit-react/issues/4969)
* Revert "chore(release): publish" ([f507bec](https://github.com/pentaho/hv-uikit-react/commit/f507becd237290280f3362427fc658df6c37cd64))
* Revert "chore(release): publish" ([7b00a9d](https://github.com/pentaho/hv-uikit-react/commit/7b00a9d7a76c35c3f1bf25433ac1c07a98d12e0c))
* Revert "chore(release): publish" ([0261483](https://github.com/pentaho/hv-uikit-react/commit/0261483ff517270d18a47caf4c0982910f594fda))
* Revert "chore(release): publish" (#4369) ([6f16a6d](https://github.com/pentaho/hv-uikit-react/commit/6f16a6dbde951a4dd1b32a08e9a26c71295600f1)), closes [#4369](https://github.com/pentaho/hv-uikit-react/issues/4369)
* Revert "chore(release): publish" ([c4fae1b](https://github.com/pentaho/hv-uikit-react/commit/c4fae1bf354a0f3c7f3db4f1b16d520380f0f85f))
* Revert "chore(release): publish" ([ecea29c](https://github.com/pentaho/hv-uikit-react/commit/ecea29c4ea42586e3c4f828492c7afecf375419e))
* Revert "chore(release): publish" ([02f40a7](https://github.com/pentaho/hv-uikit-react/commit/02f40a7f45252dd3c4c9781f30c674cb21a8f3c6))
* Revert "chore(release): publish" ([dd13624](https://github.com/pentaho/hv-uikit-react/commit/dd13624834dbd9d33745201829c137fe39a3f19c))
* "chore(release): publish" ([a580a01](https://github.com/pentaho/hv-uikit-react/commit/a580a0110faa7a2bc047bfa39d53ff2ddffba4bc))
* "chore(release): publish" ([#4972](https://github.com/pentaho/hv-uikit-react/issues/4972)) ([fd92a30](https://github.com/pentaho/hv-uikit-react/commit/fd92a30f57c51d41ee3dce9c4920a15f16abb59a))
* "chore(release): publish" ([#4980](https://github.com/pentaho/hv-uikit-react/issues/4980)) ([85a3567](https://github.com/pentaho/hv-uikit-react/commit/85a35679d698bc6e05e1cd7b26739badccdc3fe1))
