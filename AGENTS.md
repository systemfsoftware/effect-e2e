# effect-e2e

Effect-native end-to-end testing: the effect-e2e core, its web engine, its CLI and the private engine conformance suite.

Extracted from `systemfsoftware/systemfsoftware` (core); package history came with the move.

## Packages

| Package                                   | Version | Distributed  |
| ----------------------------------------- | ------- | ------------ |
| `@systemfsoftware/effect-e2e`             | 1.2.1   | yes          |
| `@systemfsoftware/effect-e2e-web`         | 1.1.2   | yes          |
| `@systemfsoftware/effect-e2e-cli`         | 1.2.1   | yes          |
| `@systemfsoftware/effect-e2e-conformance` | 0.0.0   | no (private) |

## Dependencies on core

Core packages are not installed from a registry. `flake.nix` pins core at a full commit (input `core`) and
`nix build .#sfs-deps` links the core tarballs this lockfile names. `pnpm-workspace.yaml` maps every core package
(and its transitive core closure) to `file:.sfs-deps/<name>-<version>.tgz` through `overrides`; the moved manifests
name ordinary semver ranges. To take newer core packages: bump the `core` input, update the override versions,
rebuild `.sfs-deps`, run `pnpm install`.

Local setup:

```bash
mkdir -p .sfs-deps && cp -L --no-preserve=mode "$(nix build --no-link --print-out-paths .#sfs-deps)"/*.tgz .sfs-deps/
pnpm install
```

## Gate

- `pnpm check:local` before delivery: dprint, build, lint, typecheck, type tests, API reports, attw, tests at the
  local conformance profile.
- CI (`.github/workflows/ci.yml`) calls core's reusable checks at a pinned core commit. A pull request runs the
  local profile and skips packages whose test hash already passed; main and the merge queue run the per-change
  profile and the browser engine suites (`test:engine`). `nix.yml` builds the flake outputs on main only.
- Never start a local mutation run; mutation runs in CI only.
- Version bumps: every change to a publishable package's packed output advances its version at least a patch.

## Conventions

- Run `pnpm --filter <pkg> <cmd>` from the root; never `cd` into packages, never `npx`.
- Commits: `type(scope): subject` (commitlint).
- Tooling scripts are TypeScript run by the toolchain already in the workspace; no synchronous IO in new scripts.
