# effect-e2e

Effect-native end-to-end testing: the effect-e2e core, its web engine, its CLI and the private engine conformance suite.

## Packages

- [`@systemfsoftware/effect-e2e`](packages/effect-e2e/README.md)
- [`@systemfsoftware/effect-e2e-web`](packages/effect-e2e-web/README.md)
- [`@systemfsoftware/effect-e2e-cli`](packages/effect-e2e-cli/README.md)
- [`@systemfsoftware/effect-e2e-conformance`](packages/effect-e2e-conformance) (private)

## Install

The following installs locally built tarballs into a new consumer directory. Run it from a checkout of this repository with Nix, Node.js 24 or newer, npm, and registry access for the other dependencies.

The npm registry returned 404 for the three effect-e2e packages when checked; this example does not install them from npm. The core dependency tarball version comes from the checkout's [workspace overrides](pnpm-workspace.yaml).

```bash
consumer="$(mktemp -d)"
core="$(nix build --no-link --print-out-paths .#sfs-deps)"
runtime="$(nix build --no-link --print-out-paths .#effect-e2e)"
cli="$(nix build --no-link --print-out-paths .#effect-e2e-cli)"
npm install --prefix "$consumer" --no-audit --no-fund "$core/effect-cell-types-12.0.2.tgz" effect@4.1.2
npm install --prefix "$consumer" --no-audit --no-fund "$runtime"
npm install --prefix "$consumer" --no-audit --no-fund "$cli"
```

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

## Compound packs

This repository publishes the [`e2e-testing`](compound-packs/e2e-testing/) Compound Engineering pack: where an end-to-end test lives, what it drives, and how it is written. Consumers declare it in `.compound-engineering/config.yaml` by git source, `ref` and `path: compound-packs`, pinned by tag:

```yaml
packs:
  - source: https://github.com/systemfsoftware/effect-e2e
    ref: compound-packs-v0.1.0
    path: compound-packs
```

`path: compound-packs` is what keeps the pack id `e2e-testing`: the pack is the child directory of that name, not the repository root. Pack-content changes retag `compound-packs-v<semver>`; pin the tag you want to reproduce.

The pack's rules cite the `testing` pack, published from `https://github.com/systemfsoftware/systemfsoftware` with its `compound-packs-v<semver>` tag and `path: compound-packs`. Citations resolve only for consumers that declare that source too, so a consumer wanting both corpora declares both sources.

## Contributing

[CONTRIBUTING.md](CONTRIBUTING.md)

## License

[Apache-2.0](packages/effect-e2e/LICENSE)
