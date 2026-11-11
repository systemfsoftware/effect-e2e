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

nix.systemfsoftware.com is the package registry for `@systemfsoftware` packages: producers push package tarballs there from `main`, consumers substitute them through flake inputs, and nothing goes to npm.

Core is a flake input (`core`, pinned at a full commit). `flake.nix` takes its tarballs whole through
`lib.mkProducerTarballs`, and `pnpm-workspace.yaml` maps each one to `file:.deps/<name>.tgz` through `overrides`.
To take newer core packages: bump the `core` input, run `nix flake lock`, regenerate the overrides with
`nix eval --raw .#packages.x86_64-linux.producer-tarballs.overrides`, then run `pnpm install`.

Local setup (the dev shell copies the tarballs into `.deps/`):

```bash
nix develop --accept-flake-config --command pnpm install
```

## Gate

- `pnpm check:local` before delivery: dprint, build, lint, typecheck, type tests, API reports, attw, tests at the
  local conformance profile.
- CI (`.github/workflows/ci.yml`) calls core's reusable checks at a pinned core commit. A pull request (and a
  merge-queue draft) runs the static lane and the affected tests (`.github/ci/pr-tests.mjs`: `turbo --affected`,
  `vitest --changed`) and no packed test job; main runs every package's whole suite at the per-change profile and the browser engine suites (`test:engine`). `nix.yml` builds the flake outputs on main only.
- nix.systemfsoftware.com is the package registry for `@systemfsoftware` packages: `nix-cache-push.yml` pushes `workspace-tarballs` and every member of `workspace-tarballs.members` (built from `github:<owner>/<repo>/<sha>`) to it from main, and nothing goes to npm.
- Never start a local mutation run; mutation runs in CI only.
- Version bumps: every change to a publishable package's packed output advances its version at least a patch.

## Conventions

- Run `pnpm --filter <pkg> <cmd>` from the root; never `cd` into packages, never `npx`.
- Commits: `type(scope): subject` (commitlint).
- Tooling scripts are TypeScript run by the toolchain already in the workspace; no synchronous IO in new scripts.
