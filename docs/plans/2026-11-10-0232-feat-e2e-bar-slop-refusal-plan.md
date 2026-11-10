---
title: effect-e2e meets the e2e bar and refuses slop tests through the compiler - Plan
type: feat
date: 2026-11-10
topic: e2e-bar-slop-refusal
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-brainstorm
execution: code
---

# effect-e2e meets the e2e bar and refuses slop tests through the compiler - Plan

## Goal Capsule

- **Objective:** A person writing web e2e tests with effect-e2e can do everything the `e2e` runner's skill teaches, and a slop e2e test does not compile.
- **Means:** The authoring API takes the shape of the `@systemfsoftware/vitest` fork: generator bodies, with every check reaching the body only through the test's own callback.
- **Product authority:** Linear SYS-1259 (its "Done when" and "Owner-approved exceptions") and the owner rulings recorded there. The bar is the skill that `e2e` 0.23.0 ships: `skills/e2e/SKILL.md` and `references/{writing-tests,agent,running}.md`.
- **Active scope:** the web engine only. Mobile engines, explore and the MCP server are not active scope; SYS-1259 records them as later, separate work.
- **Open blockers:** none. Two owner questions are listed under Outstanding Questions and do not hold planning.

---

## Product Contract

### Summary

effect-e2e replaces its raw-Vitest authoring surface with a fork-shaped e2e API on the web engine. Tests are generator bodies whose steps and checks are yielded and driven by the runner. Every behaviour the bar teaches is available through it, and each slop shape is refused with a message that names the rewrite. A conformance profile shows parity behaviour by behaviour.

### Problem Frame

An effect-e2e author cannot make an exact interaction from a test, and the matcher, fixture, session, registration and cache-mode surface is a fraction of what `e2e` teaches. `ScreenFixture` returns locator data with no actions, `AppFixture` has one method, and `ScreenExpectation` has eight matchers. Registration goes through raw Vitest, which the fork's guard refuses.

Nothing stops a slop test: ten checks on one screen, no check at all, or only a model judgment. Review is the only defence, and review misses them. The fork shows the alternative for unit tests: the compiler counts a test's checks and refuses the shape. e2e tests need the same discipline on top of full parity with the bar.

### Key Decisions

- **Fork-shaped generator authoring.** Bodies are generators and every step and check is yielded. Governs R1, R2, R3, R4, R5. (session-settled: user-directed — chosen over async bodies with runtime-first refusals, and over typestate goal pinning: async bodies cannot make the Goal's own slop shapes fail to compile, and pinning adds machinery the rulings do not ask for.)
- **A check is bound to its test through the body's callback; there is no importable `expect`.** This is how the compiler counts a test's checks and refuses raw ones. Governs R1, R8. (session-settled: user-directed — chosen over a module-level `expect` import: the import is surface syntax, not a taught behaviour, and it breaks the binding the fork's mechanism relies on.)
- **Web engine only.** Governs R11 through R26. (session-settled: user-directed — chosen over web plus mobile, and over every engine: SYS-1259 records mobile, explore and MCP as later, separate work.)
- **No further exceptions.** Every web behaviour the bar teaches is built here, including screenshot comparison, video, and alternative agent executors. Governs R11 through R26. (session-settled: user-directed — chosen over proposing those groups as exceptions: "if our library doesn't reach the bar somebody needs to fix it.")
- **Model judgments never satisfy the no-check gate.** The replay cache may still treat `agent.assert` and `agent.waitFor` as confirmation for recording; the two rules stay separate. Governs R3, R25. (session-settled: user-approved — the agent proposed this with the tradeoff shown; the owner assented.)
- **Hooks exist; each test gets fresh fixtures.** Shared-state slop is refused by a run-time guard where types cannot see it. Governs R15. (session-settled: user-approved — chosen over refusing hooks as the fork does: the bar teaches hooks, and fresh fixtures remove what the fork refuses them for.)
- **e2e tests run once.** The fork's second run on a fresh build is not carried over; shared-state detection rests on R15 alone. Governs R16. (session-settled: user-approved — the owner ruled it; the lost leak check was shown as the accepted cost.)
- **Parity is proven, not claimed.** A bar-parity profile in the private conformance suite exercises each taught behaviour through the public API. Governs R27, R28. (session-settled: user-approved — the agent proposed the form; the owner assented.)

### Requirements

**Authoring model**

- R1. A test body is a generator that receives the test's own checks as a callback parameter; effect-e2e exports no `expect`, and a check taken from elsewhere is refused.
- R2. A synchronous body, an `async` body, and a body that returns an Effect each fail to compile at the body, and the message names the generator rewrite.
- R3. A test whose body yields no exact check fails to compile at the test name, and the message names the rewrite. Only exact screen, browser and value checks count; `agent.assert`, `agent.waitFor` and `agent.extract` never do.
- R4. A body can yield only e2e steps and checks. A sleep, a fixed delay or a polling loop has no yieldable form, and the refusal names `waitFor` or a matcher `timeout` as the rewrite.
- R5. Two checks on one observed state are refused, and the message names the single-check rewrite. An observed state ends at any step that can change the screen or the page.
- R6. A weak check is refused with its rewrite: at least the fork's boolean-actual, vacuous-match and missing-argument cases, plus the e2e-specific weak checks that planning enumerates against the bar's matcher list.
- R7. A check that is written and never yielded is refused, and the existing detection of unawaited steps stays.
- R8. A test registered through raw Vitest `test` or `it`, or a check from raw Vitest `expect`, is refused with the rewrite named.
- R9. Every refusal message names its rewrite. A shape is refused at compile time wherever types can see it; every other shape is refused at run time with the same text.
- R10. For each slop shape the Goal names (many checks, no check, a model judgment as the only check), a type-level test shows a failing `tsc` run at the slop code. If planning shows `tsc` cannot reach the several-checks shape, that is recorded as a proposed exception for owner approval in SYS-1259, never left as review or documentation.

**Registration and run rules**

- R11. `test` takes the options the bar teaches: `timeout`, `retries` (0 to 10), `tags`, `skip`, `fail`, `platforms`, `requires`, `session`, `agentContext`, `agent` (a name, or a list run once per agent), `trace` and `video` modes. `describe` takes the group-level subset the bar names. A serial group and its members follow the bar's option restrictions, and a nested serial group is a collection error.
- R12. `test.skip` works bare and conditionally from the body, before the first step, and the report records the reason. `test.fail` marks an expected failure that passes on a test failure or timeout and fails with `UNEXPECTED_PASS` on a pass. An infrastructure error, such as an engine failure, still fails the test.
- R13. `test.only` works locally and is refused in CI with `ONLY_IN_CI`.
- R14. A `describe` body is synchronous, and an `async` one is a `COLLECTION_ERROR`. Serial groups run their members in order on one worker and retry as a whole.
- R15. `beforeEach`, `afterEach`, `beforeAll` and `afterAll` exist with the bar's ordering, timeout and failure semantics, and every test receives fresh fixtures. State shared between tests through a hook is refused by a guard.
- R16. An e2e test runs once. There is no second run on a fresh build; retries happen only as the bar's retry rules say.

**Fixtures, locators and checks**

- R17. `app` provides `baseUrl`, `open`, `back`, `restart`, `clearState`, `screenshot`, `startRecording` and `stopRecording`, with the bar's failure behaviour.
- R18. `screen` provides the bar's locator queries and options, strictness with `LOCATOR_AMBIGUOUS`, `filter`, `first`, `last`, `nth`, `or`, scoping, `visible`, scrolling to a locator, `tree` and `debug`.
- R19. A test can act exactly: `tap`, `doubleTap`, `secondaryTap`, `longPress`, `fill` (text or secret), `pressSequentially`, `clear`, `press`, `check`, `uncheck`, `selectOption`, `focus`, `hover`, `setInputFiles`, `dragTo`, `scrollIntoView`, `swipe`, and the coordinate forms. A test can read as the bar's reads do, including `count` and `waitFor({ state })`.
- R20. Checks cover the bar's locator, browser and value matcher tables, including `toHaveCount` and `toHaveURL`, list forms, `.not` with its hold rule, `soft`, `poll`, `toMatchSchema`, the asymmetric matchers, and the option flips. Screenshot comparison covers snapshot files, update mode, masking and per-target files.
- R21. The browser fixture provides navigation, page reads, raw locators, frame locators, `evaluate`, init scripts, routes with `fulfill`, `continue`, `fallback` and `abort`, `waitForResponse`, cookies, viewport, media emulation, dialogs, downloads, and raw keyboard and mouse.
- R22. `test.extend` adds fixtures whose code after `use()` runs after a failing test too; a fixture applies only to tests registered through its own `test`.
- R23. Sign-in sessions work: a setup test saves a named session once, dependent tests declare it, setup runs when only a dependent test is selected, and the setup restrictions hold. Credentials and secrets are opaque handles, redacted from reports, step labels, and model input, and accepted only by `fill` and agent params.
- R24. The `platform` fixture is available in tests and hooks.

**Agent and cache**

- R25. The agent keeps `act`, `assert`, `waitFor` and `extract` with the bar's options, budgets, error codes, `unique()` params, `onBeforeAction` and `onAction` hooks, per-agent configuration, and the vision modes on judgments that exist today. Agent `tools` and the alternative executors (decision-model, coding-agent, custom `StepExecutor`) are available.
- R26. Strict-cache mode fails a step whose committed recording no longer replays with `REPLAY_STALE`, replays on retries, and never writes the cache. The cache modes and the record-after-confirmation rule stay as they are.

**Proof and cutover**

- R27. A bar-parity profile in the private conformance suite exercises each behaviour in R11 through R26 through the public API against the web engine, and a table maps each taught behaviour to its evidence.
- R28. The parity profile runs in CI's engine-suite lane, and `pnpm check:local` runs it at the local profile.
- R29. The current API is removed in the same change set that replaces it: scaffolds, CLI `init` templates, package READMEs and fixtures migrate, and no old-API path or compatibility layer remains.
- R30. The author-facing run rules of `references/running.md` that the web engine exercises (selection by file and line, tags, grep, last-failed and shard, the CI defaults, exit-code classes, trace pages, `report.json`) are available through the CLI and runner API.

### Acceptance Examples

- AE1. **Covers R3.** Given a test that opens a page and runs `agent.act` with no exact check after it, `tsc` reports an error at the test name, and the message names yielding a check from the callback.
- AE2. **Covers R3, R25.** Given a test whose only check is `agent.assert('the dashboard loads')`, `tsc` reports the same no-check error, and the message says a model judgment does not count.
- AE3. **Covers R4.** Given a body that waits with `setTimeout` between steps, no yielded form compiles, and the message names `waitFor`.
- AE4. **Covers R5.** Given a test that checks a list's count, then its heading, then its status text on the same screen with no step between, the second check is refused and the message names the single-check rewrite.
- AE5. **Covers R1, R8.** Given a test that imports `expect` from `vitest` or registers with `it`, the run refuses the test and names the callback-parameter rewrite.
- AE6. **Covers R13.** Given `test.only` in a run with `CI` set, the run fails with `ONLY_IN_CI`; locally it runs the one test.
- AE7. **Covers R12.** Given a `test.fail` test whose body passes, the test fails with `UNEXPECTED_PASS`.
- AE8. **Covers R22.** Given an extended fixture that creates a record and deletes it after `use()`, the delete runs when the test body fails.
- AE9. **Covers R26.** Given committed recordings and strict-cache mode, a step whose recording no longer replays fails with `REPLAY_STALE` and the run writes no cache entry.
- AE10. **Covers R16.** Given a passing e2e test, the runner executes the body once.

### Success Criteria

- Each behaviour the three bar files teach has a row in the R27 table that names the public API and the test that proves it.
- Each Goal slop shape fails `tsc` at the slop code with a message that names its rewrite, and a type-level test pins that.
- `pnpm check:local` passes on each PR's head, and each PR merges through the merge queue.
- A reader of the compound `e2e-testing` pack can write its examples against this API without leaving the bar's taught behaviours.

### Scope Boundaries

**Deferred for later (SYS-1259 records these as owner-approved)**

- Mobile engines (iOS and Android), explore runs, and the MCP server.

**Outside this work**

- Moving any test to another runner, or writing a test around a gap.
- A compatibility layer or migration shim for the current API; the younna consumer has zero specs.
- The fork's second run on a fresh build.
- Editing graders, lints, typecheck or workflows to get green.

### Dependencies / Assumptions

- The compound `e2e-testing` pack (systemfsoftware PR #919) writes its examples in this API, so its examples follow this plan.
- The fork's refusal mechanism (`packages/runner/vitest` in systemfsoftware) is the starting point. Changes to the fork are a separate PR in that repository.
- The web engine sits on Playwright (`packages/effect-e2e-web`), so browser behaviours in R20 and R21 delegate to it where it already provides them. [Assumption: the engine SPI can carry the new actions and reads without a mobile engine in view.]
- Core packages come from the pinned `core` input and `.sfs-deps` tarballs; any core change is outside this repo.

### Outstanding Questions

**Resolve Before Planning**

- None.

**Deferred to Planning**

- The exact set of e2e-specific weak checks for R6, enumerated against the bar's matcher table.
- Whether `tsc` can reach the several-checks shape (R5, R10); the answer decides the exception request in R10.
- The yieldable representation of exact actions, reads, checks and fixtures, and how a single check spans several locators on one state (see the owner question below).
- The PR split. Candidate seams: authoring model and refusals, exact actions and the full matcher set, browser fixture, fixtures and sessions, strict cache, parity profile.

**Owner questions (raised in the report; neither holds planning)**

- The bar's own example file checks a list count, a status text, and the URL after one goal. R5 refuses that shape as written. The plan assumes the taught behaviour is the matchers and that a single check can carry several facts about one state; confirm that this reading holds.
- Confirm that a run-time refusal is acceptable for any slop shape `tsc` provably cannot reach, once the plan names why, or whether each such shape needs its own recorded exception.
- The bar teaches `expect.soft` (a failure is kept and the body runs on) and `expect.poll`. The fork refuses both as slop shapes, so under the fork's binding neither is reachable as taught. R20 keeps both; confirm whether they are carried in their taught form, as a check kind the ledger counts once, or whether each needs a recorded exception.

### Sources / Research

- The bar: the `e2e` 0.23.0 package's `skills/e2e/SKILL.md` and `references/writing-tests.md`, `agent.md`, `running.md`.
- The fork: `packages/runner/vitest/src/mod.ts`, `internal/checks.ts`, `internal/refusals.ts`, `guard.ts` in systemfsoftware.
- Current authoring surface: `packages/effect-e2e/src/runner/test-api.ts`, `fixtures.ts`, `screen-expectation.ts`.
- Engine actions already present: `packages/effect-e2e/src/engine/action.schema.ts`.
- Cache modes today: `packages/effect-e2e/src/cache/cache-store.schema.ts`.
- Web engine: `packages/effect-e2e-web/src/`.
