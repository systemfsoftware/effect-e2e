# Contributing

## Dependencies on core

nix.systemfsoftware.com is the package registry for `@systemfsoftware` packages: producers push package tarballs there from `main`, consumers substitute them through flake inputs, and nothing goes to npm. Core's tarballs reach this repository through the `core` flake input, and `pnpm-workspace.yaml` maps them to `file:.deps/*.tgz` overrides.

To take newer core packages:

1. Bump the `core` input.
2. Run `nix flake lock`.
3. Regenerate the overrides with `nix eval --raw .#packages.x86_64-linux.producer-tarballs.overrides` and replace the block in `pnpm-workspace.yaml`.
4. Run `pnpm install`.

Third-party dependencies come from the configured npm registry; `@systemfsoftware` packages come from nix.systemfsoftware.com, never from npm. The verified `pnpm install` reused a warm store; it was not a cold or offline verification.

## Local setup

```bash
nix develop --accept-flake-config --command pnpm install
```
