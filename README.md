# effect-e2e

effect-e2e is end-to-end testing for Effect code. A suite's `e2e.config.ts` declares its target, engine and agent as plain data; the runner decodes that config once, at the edge, and reports any invalid key by its path. The web engine drives a browser, and the `effect-e2e` command scaffolds a suite and runs it.

## Packages

| Package                                                                | What it is                                                     |
| ---------------------------------------------------------------------- | -------------------------------------------------------------- |
| [`@systemfsoftware/effect-e2e`](packages/effect-e2e/README.md)         | The runtime-neutral core: config, the runner and the test API. |
| [`@systemfsoftware/effect-e2e-web`](packages/effect-e2e-web/README.md) | The web engine, which drives a browser through Playwright.     |
| [`@systemfsoftware/effect-e2e-cli`](packages/effect-e2e-cli/README.md) | The `effect-e2e` command: `init` and `run`.                    |
| `@systemfsoftware/effect-e2e-conformance`                              | The engine conformance suite. Private, not published.          |

## Install

These packages are not on npm. They are distributed as Nix tarballs from [nix.systemfsoftware.com](https://nix.systemfsoftware.com), the registry for `@systemfsoftware` packages.

Add this repository as a flake input, and take its tarballs through [pnpm-release-management](https://github.com/systemfsoftware/pnpm-release-management#distribution-through-nix). `@systemfsoftware/vitest-config`, a peer of the CLI, comes from the systemfsoftware flake the same way:

```nix
{
  nixConfig = {
    extra-substituters = "https://nix.systemfsoftware.com";
    extra-trusted-public-keys = "nix-cache-1:wXA8I4DayNW9q6enUyQA/P/nT38pGSTLt374t3gsn7M=";
    fallback = true;
  };

  inputs = {
    nixpkgs.follows = "effect-e2e/nixpkgs";
    effect-e2e.url = "github:systemfsoftware/effect-e2e/<rev>";
    systemfsoftware.url = "github:systemfsoftware/systemfsoftware/<rev>";
    pnpm-release-management.url = "github:systemfsoftware/pnpm-release-management";
  };

  outputs = { self, nixpkgs, effect-e2e, systemfsoftware, pnpm-release-management }:
    let
      lib = nixpkgs.lib;
      forEachSystem = fn: lib.genAttrs [ "x86_64-linux" "aarch64-linux" ] (system: fn nixpkgs.legacyPackages.${system});
    in
    {
      packages = forEachSystem (pkgs: rec {
        producer-tarballs = pnpm-release-management.lib.mkProducerTarballs {
          inherit pkgs;
          producers = { inherit effect-e2e systemfsoftware; };
        };
        pnpm-store = pnpm-release-management.lib.mkPnpmConsumerStore {
          inherit pkgs;
          src = self;
          files.".deps" = producer-tarballs;
        };
      });

      devShells = forEachSystem (pkgs: {
        default = pkgs.mkShell {
          shellHook = self.packages.${pkgs.stdenv.hostPlatform.system}.producer-tarballs.shellHook;
        };
      });
    };
}
```

Replace each `<rev>` with the commit you pin. Nix only applies `nixConfig` for trusted users or with `--accept-flake-config`.

Point your `package.json` at the tarballs and install the third-party peers from npm:

```json
{
  "devDependencies": {
    "@systemfsoftware/effect-e2e": "file:.deps/effect-e2e.tgz",
    "@systemfsoftware/effect-e2e-cli": "file:.deps/effect-e2e-cli.tgz",
    "@systemfsoftware/effect-e2e-web": "file:.deps/effect-e2e-web.tgz",
    "@systemfsoftware/vitest-config": "file:.deps/vitest-config.tgz",
    "effect": "^4",
    "vitest": "^5.0.5"
  }
}
```

Add `.deps/` to `.gitignore`, then run `pnpm install` inside the dev shell. The peers `effect` and `vitest` must be provided by the suite. `playwright` is a peer of the web engine and the CLI, and it comes from npm too.

## Usage

Scaffold a suite with the web engine and the OpenRouter gateway, without installing its dependencies:

```bash
pnpm exec effect-e2e init --dir my-suite --engine web --gateway openrouter --no-install
```

`init` writes `e2e.config.ts`, `vitest.config.ts`, `runner.ts`, `global-setup.ts` and two example tests. Install the suite's dependencies, then run it:

```bash
pnpm exec effect-e2e run --dir my-suite
```

`run` accepts `--target <name>` to run one target, `--tag <tag>` to run tests carrying a tag, `--reporter list|json|junit|markdown`, and `--no-cache` to run every step against the model instead of replaying recorded steps. The suite's agent calls the gateway you chose, so that gateway's credentials must be in the run's environment.

The [`@systemfsoftware/effect-e2e` README](packages/effect-e2e/README.md) describes the config API and the `ai-trace.json` file that records model calls for a failed try.

## Contributing

Development setup, the gate and the conventions are in [CONTRIBUTING.md](CONTRIBUTING.md).

## Support

Report bugs and request features in the [issue tracker](https://github.com/systemfsoftware/effect-e2e/issues).

## License

Apache-2.0. See [`packages/effect-e2e/LICENSE`](packages/effect-e2e/LICENSE).
