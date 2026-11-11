# effect-e2e

Effect-native end-to-end testing: the effect-e2e core, its web engine, its CLI and the private engine conformance suite.

## Packages

- [`@systemfsoftware/effect-e2e`](packages/effect-e2e/README.md)
- [`@systemfsoftware/effect-e2e-web`](packages/effect-e2e-web/README.md)
- [`@systemfsoftware/effect-e2e-cli`](packages/effect-e2e-cli/README.md)
- [`@systemfsoftware/effect-e2e-conformance`](packages/effect-e2e-conformance) (private)

## Install

nix.systemfsoftware.com is the package registry for `@systemfsoftware` packages: producers push package tarballs there from `main`, consumers substitute them through flake inputs, and nothing goes to npm. Take `effect-e2e`, `effect-e2e-cli` and `effect-e2e-web` from this repository's flake (`packages.<system>.<name>`) through a flake input, and install `effect@4.1.2` beside them. None of them is on npm.

## Usage

Use the installed CLI to generate a suite without installing its dependencies:

```bash
"$consumer/node_modules/.bin/effect-e2e" init --dir "$consumer/demo" --engine web --gateway openrouter --no-install
```

```text
effect-e2e init: scaffolding demo in <consumer-directory>/demo
  wrote e2e.config.ts
  wrote vitest.config.ts
  wrote runner.ts
  wrote global-setup.ts
  wrote tests/example.e2e.ts
  wrote tests/example-agent.e2e.ts
  wrote package.json
  wrote .gitignore
Run the suite with its test:e2e script from <consumer-directory>/demo
```

The scaffold was generated without running a browser, a test suite, or a model. Its dependencies must be installed before running the suite.

[`@systemfsoftware/effect-e2e` usage](packages/effect-e2e/README.md#usage) · [`@systemfsoftware/effect-e2e-cli` usage](packages/effect-e2e-cli/README.md#usage)

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

[Apache-2.0](packages/effect-e2e/LICENSE)
