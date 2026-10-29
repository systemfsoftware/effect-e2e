import * as Schema from 'effect/Schema'

import { Cause, ProposedCause } from './cause.schema.js'
import { EvidenceRef } from './check.schema.js'

export const FailureCode = Schema.Literals([
  'MODEL_UNAVAILABLE',
  'MODEL_PROVIDER_FAILED',
  'MODEL_REFUSED',
  'AUTH_CREDENTIAL_UNAVAILABLE',
  'AUTH_CREDENTIAL_INVALID',
  'SECRET_UNAVAILABLE',
  'ENVIRONMENT_UNAVAILABLE',
  'APP_UNREACHABLE',
  'APP_NOT_OPEN',
  'ARTIFACT_WRITE_FAILED',
  'LOCATOR_NOT_FOUND',
  'LOCATOR_AMBIGUOUS',
  'ACTION_FAILED',
  'AUTOMATION_UNSUPPORTED',
  'UNSUPPORTED_CAPABILITY',
  'STEP_BUDGET_EXHAUSTED',
  'STEP_TIMEOUT',
  'STEP_NO_CONCLUSION',
  'STEP_NOT_AWAITED',
  'REPLAY_STALE',
  'POLICY_DENIED',
  'CONTEXT_OVERFLOW',
  'MODEL_OUTPUT_INVALID',
  'ASSERTION_INCONCLUSIVE',
  'ASSERTION_FAILED',
  'INTERRUPTED',
  'INTERNAL_ERROR',
])
export type FailureCode = typeof FailureCode.Type

export const Evidence = Schema.NonEmptyArray(EvidenceRef)
export type Evidence = typeof Evidence.Type

export class ModelUnavailable
  extends Schema.TaggedError<ModelUnavailable, { readonly brand: unique symbol }>()('MODEL_UNAVAILABLE', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class ModelProviderFailed
  extends Schema.TaggedError<ModelProviderFailed, { readonly brand: unique symbol }>()('MODEL_PROVIDER_FAILED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class ModelRefused
  extends Schema.TaggedError<ModelRefused, { readonly brand: unique symbol }>()('MODEL_REFUSED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class AuthCredentialUnavailable
  extends Schema.TaggedError<AuthCredentialUnavailable, { readonly brand: unique symbol }>()(
    'AUTH_CREDENTIAL_UNAVAILABLE',
    {
      message: Schema.String,
      evidence: Evidence,
    },
  )
{}

export class AuthCredentialInvalid
  extends Schema.TaggedError<AuthCredentialInvalid, { readonly brand: unique symbol }>()('AUTH_CREDENTIAL_INVALID', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class SecretUnavailable
  extends Schema.TaggedError<SecretUnavailable, { readonly brand: unique symbol }>()('SECRET_UNAVAILABLE', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class EnvironmentUnavailable
  extends Schema.TaggedError<EnvironmentUnavailable, { readonly brand: unique symbol }>()('ENVIRONMENT_UNAVAILABLE', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class AppUnreachable
  extends Schema.TaggedError<AppUnreachable, { readonly brand: unique symbol }>()('APP_UNREACHABLE', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class AppNotOpen extends Schema.TaggedError<AppNotOpen, { readonly brand: unique symbol }>()('APP_NOT_OPEN', {
  message: Schema.String,
  evidence: Evidence,
}) {}

export class ArtifactWriteFailed
  extends Schema.TaggedError<ArtifactWriteFailed, { readonly brand: unique symbol }>()('ARTIFACT_WRITE_FAILED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class LocatorNotFound
  extends Schema.TaggedError<LocatorNotFound, { readonly brand: unique symbol }>()('LOCATOR_NOT_FOUND', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class LocatorAmbiguous
  extends Schema.TaggedError<LocatorAmbiguous, { readonly brand: unique symbol }>()('LOCATOR_AMBIGUOUS', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class ActionFailed
  extends Schema.TaggedError<ActionFailed, { readonly brand: unique symbol }>()('ACTION_FAILED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class AutomationUnsupported
  extends Schema.TaggedError<AutomationUnsupported, { readonly brand: unique symbol }>()('AUTOMATION_UNSUPPORTED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class UnsupportedCapability
  extends Schema.TaggedError<UnsupportedCapability, { readonly brand: unique symbol }>()('UNSUPPORTED_CAPABILITY', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class StepBudgetExhausted
  extends Schema.TaggedError<StepBudgetExhausted, { readonly brand: unique symbol }>()('STEP_BUDGET_EXHAUSTED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class StepTimeout extends Schema.TaggedError<StepTimeout, { readonly brand: unique symbol }>()('STEP_TIMEOUT', {
  message: Schema.String,
  evidence: Evidence,
}) {}

export class StepNoConclusion
  extends Schema.TaggedError<StepNoConclusion, { readonly brand: unique symbol }>()('STEP_NO_CONCLUSION', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class StepNotAwaited
  extends Schema.TaggedError<StepNotAwaited, { readonly brand: unique symbol }>()('STEP_NOT_AWAITED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class ReplayStale extends Schema.TaggedError<ReplayStale, { readonly brand: unique symbol }>()('REPLAY_STALE', {
  message: Schema.String,
  evidence: Evidence,
}) {}

export class PolicyDenied
  extends Schema.TaggedError<PolicyDenied, { readonly brand: unique symbol }>()('POLICY_DENIED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class ContextOverflow
  extends Schema.TaggedError<ContextOverflow, { readonly brand: unique symbol }>()('CONTEXT_OVERFLOW', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class ModelOutputInvalid
  extends Schema.TaggedError<ModelOutputInvalid, { readonly brand: unique symbol }>()('MODEL_OUTPUT_INVALID', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class AssertionInconclusive
  extends Schema.TaggedError<AssertionInconclusive, { readonly brand: unique symbol }>()('ASSERTION_INCONCLUSIVE', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class AssertionFailed
  extends Schema.TaggedError<AssertionFailed, { readonly brand: unique symbol }>()('ASSERTION_FAILED', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export class Interrupted extends Schema.TaggedError<Interrupted, { readonly brand: unique symbol }>()('INTERRUPTED', {
  message: Schema.String,
  evidence: Evidence,
}) {}

export class InternalError
  extends Schema.TaggedError<InternalError, { readonly brand: unique symbol }>()('INTERNAL_ERROR', {
    message: Schema.String,
    evidence: Evidence,
  })
{}

export const FailureError = Schema.Union([
  ModelUnavailable,
  ModelProviderFailed,
  ModelRefused,
  AuthCredentialUnavailable,
  AuthCredentialInvalid,
  SecretUnavailable,
  EnvironmentUnavailable,
  AppUnreachable,
  AppNotOpen,
  ArtifactWriteFailed,
  LocatorNotFound,
  LocatorAmbiguous,
  ActionFailed,
  AutomationUnsupported,
  UnsupportedCapability,
  StepBudgetExhausted,
  StepTimeout,
  StepNoConclusion,
  StepNotAwaited,
  ReplayStale,
  PolicyDenied,
  ContextOverflow,
  ModelOutputInvalid,
  AssertionInconclusive,
  AssertionFailed,
  Interrupted,
  InternalError,
])
export type FailureError = typeof FailureError.Type

export const FailureRecord = Schema.Struct({
  code: FailureCode,
  cause: Cause,
  evidence: Evidence,
  proposed: Schema.optionalKey(ProposedCause),
})
export type FailureRecord = typeof FailureRecord.Type
