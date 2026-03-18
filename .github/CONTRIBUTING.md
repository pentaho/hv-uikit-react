# Contributing

We welcome contributions to our project. You can help us fixing bugs or submit any new ideas, as [pull requests](#submitting-a-pull-request) or as [GitHub issues](#submitting-an-issue).

## Getting started

```sh
# Clone the repository
git clone git@github.com:pentaho/hv-uikit-react.git
cd hv-uikit-react
# Install the dependencies
npm i
# Start the dev environment
npm run doc
```

## Submitting an Issue

Use our [GitHub issue templates](https://github.com/pentaho/hv-uikit-react/issues/new/choose) when filing issues.
Before submitting, search existing issues to check if your question or bug has already been addressed.

## Submitting a Pull Request

All contributions should target the `master` branch (or a previous supported major version). Maintainers will review and merge approved pull requests.

### Commit message guidelines

We enforce [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specs over how our git commit messages should be formatted.
This leads to more readable messages that are easy to follow when looking through the project history. The git commit messages are also used to generate the change log.

Commits must be prefixed with a `type` in order to communicate intent, an optional `scope` may be provided after a type.

Examples:

```txt
fix(Button): incorrect disabled behavior
feat(Dialog): add fullScreen property
docs(Avatar): add missing AvatarGroup docs
test(a11y): add coverage for aria-actions
chore(deps): bump dev dependencies
```

### Coding Standards

We strive to enforce our standards as seamlessly and automatically as possible, by declaring them in the linter and code formatter, and enforcing them in the CI pipeline.

To validate locally, run:

```sh
npm run check
```

Furthermore, Copilot is fed our [best-practices instructions](/.github/instructions) to help contributors follow our conventions and standards when writing code and in review.

### Tests

We run various quality checks on each pull request, which must all pass for it to be merged.
Run `npm run check` and `npm test` to validate locally.

Our [Pull Request CI pipeline](/.github/workflows/pr.yml) runs:

- Static checks (linting, formatting, security checks)
- Unit tests (Vitest)
- Accessibility & component tests (Storybook)
- Visual regression tests (Chromatic)

Please keep an eye on the PR's Checks for detailed feedback and ensure all tests pass before requesting a review.

## Local development

To test your changes in a local project, you can link the UI Kit packages using `npm link`.
This allows you to use your local version of the UI Kit in other projects without publishing it.

```sh
# in the UI Kit root directory
npm link -ws

# in your local project directory
npm link @hitachivantara/uikit-react-core
```

If package publishing is required, they can be easily published to a separate registry (eg. [Verdaccio](https://verdaccio.org/)) like so:

```sh
npm publish -w packages/core --registry http://localhost:4873
```
