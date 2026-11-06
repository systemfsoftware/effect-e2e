# Contributing

## Dependencies on core

Core packages are not installed from a registry. `flake.nix` pins core at a full commit (input `core`) and
`nix build .#sfs-deps` links the core tarballs this lockfile names. `pnpm-workspace.yaml` maps every core package
(and its transitive core closure) to `file:.sfs-deps/<name>-<version>.tgz` through `overrides`; the moved manifests
name ordinary semver ranges.

To take newer core packages:

1. Bump the `core` input.
2. Update the override versions.
3. Rebuild `.sfs-deps`.
4. Run `pnpm install`.

Other external dependencies use the configured npm registry (the default is the public npm registry), so registry access
is needed when they are not cached. The verified `pnpm install` reused a warm store; it was not a cold or offline verification.

## Local setup

```bash
mkdir -p .sfs-deps && cp -L --no-preserve=mode "$(nix build --no-link --print-out-paths .#sfs-deps)"/*.tgz .sfs-deps/
pnpm install
```
