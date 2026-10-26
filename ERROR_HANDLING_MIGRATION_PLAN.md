# API Error Handling & Mixpanel Migration Plan

Source: `Discovery-App` branch `update-api-error-handling` (merge-base `5c9ba314` with `main`).
Target: this repo (`Discovery-custom-SDK`), branch `update-api-error-handling`.

## Where we already stand

This repo already has most of the plumbing ported from Discovery-App:

| Piece | Discovery-App | This repo | Status |
|---|---|---|---|
| `ApiError` type + `ensureApiError`/`serverMessage`/`catchApiError` | `src/app/service/api-error.ts` | `src/app/interceptors/api-error.interceptor.ts` | ✅ ported |
| `ApiErrorInterceptor` (normalizes every failed request) | `src/app/service/api-error.ts` | `apiErrorInterceptor` (functional interceptor) | ✅ ported |
| `HANDLE_AUTH_ERROR` token + auth interceptor | `src/app/service/auth-error.interceptor.ts` | `src/app/interceptors/auth-error.interceptor.ts` | ✅ ported, adapted for SDK (no logout — notifies parent + navigates to `/not-found`) |
| Interceptor registration order (token → auth-error → api-error) | `app.module.ts` | `app.config.ts` (`withInterceptors`) | ✅ matches |
| `STATUS_CODE` map | `network-constants.ts` | `constants/network-constants.ts` (via `K.NETWORK.STATUS_CODE`) | ✅ present (missing `INVALID` alias, not needed) |
| `ApiErrorNotificationEffects` (toast-on-failure) | `src/app/service/api-error.ts` | — | N/A — this SDK has no NgRx store/toast system; parent-notification (`notify-parent.ts`) is the equivalent channel |

**What's not done yet — this plan covers the remaining gap:**

1. `network.service.ts` still treats a 200 response with `body.statusCode >= 400` as a soft failure and re-throws it (`handleRequest`, lines ~44-61). Discovery-App removed this because its backend migration moved logical failures out of 200-body envelopes into real HTTP status codes.
2. Component layer (`instructions.component.ts`, `bdna-reports.component.ts`, `fdna-reports.component.ts`) still branches on `response.body.statusCode === 200` instead of trusting the HTTP outcome / reading `data` directly.
3. Mixpanel service has no dev-mode payload logging, and failure paths don't consistently emit a matching `'<Feature> Failed'` event with `errorMessage`/`statusCode`.

## ⚠️ Backend precondition — verify before touching statusCode checks

Discovery-App's own code comments flag that the "200-body-envelope → real HTTP status" backend migration was **not uniformly complete across environments** (QA still wrapped some logical errors in a 200 body; dev didn't). This repo actually targets **two different backends depending on config**, which matters a lot here:

- `environment.ts` (default/`local`) and `environment.qa.ts`/`environment.sandbox.ts` point `privateNoAuthUrl` at **`apimuatenvironment.azure-api.net/private-no-auth/`** (UAT). Confirmed live: `Accounts/GetAccountDetailsByAccountIdandSelfregId` returns `200 OK` with `{ "statusCode": 400, "errors": {...} }` in the body — the **old envelope pattern is still active here**.
- `environment.ts` (default) and `environment.dev.ts` both now point at `devapimanagementenvironment.azure-api.net/token-less-api/` (`dev-private-api/` for authenticated calls), matching Discovery-App's default `environment.ts` — **decided and applied**. `environment.qa.ts`/`environment.sandbox.ts` still point at `apimuatenvironment` (UAT) and were left as-is; that host still uses the old `statusCode`-in-body envelope.

With this change, `local`/`development`-configuration builds (this repo's most common local dev path) now consistently get the new (no-`statusCode`) response shape from the account-settings endpoint, confirmed live: `200 OK` `{ "message": "Success", "data": {...} }`, no `statusCode` field. UAT/QA/sandbox builds still get the old envelope: `200 OK` `{ "statusCode": 400, "errors": {...} }` for a logical failure. `network.service.ts`'s `body.statusCode >= 400` fallback must stay in place to keep UAT/QA/sandbox working — it now acts as backward-compatibility for those three configs rather than the primary path.

**So the same endpoint behaves differently depending on which environment file is active.** Do not blanket-remove the `body.statusCode >= 400` re-throw in `network.service.ts` — it's still required for UAT/QA/sandbox. Any `statusCode`-check removal in a component must tolerate both shapes (see the `res.body?.data ?? res.body` pattern used in the fixes below), not assume the new shape unconditionally.

### ✅ Confirmed and fixed in this pass

Running the app end-to-end against the real dev backend (`devapimanagementenvironment`) with a valid test account (`accountId 1244` / `selfRegistrationId 145`, from a `devdiscovery.dnabehavior.com` URL) surfaced a **live bug**, not just a hypothetical: `instructions.component.ts`'s `getAccountSettings()` and `createUser()` both required `res.body.statusCode === 200` to treat a response as success. On the dev backend, which sends no `statusCode` on success, this was **always false** — every successful call was misread as a failure, immediately routing to `/not-found` with "SDK Initialization Failed / Unable to get account details".

Fixed (this pass):
- `instructions.component.ts` `getAccountSettings()` (was line ~201) — now trusts the resolved subscription (a real failure already throws via `NetworkService`/`catchApiError` upstream) and reads `res.body?.data ?? res.body`.
- `instructions.component.ts` `createUser()` (was line ~351) — same fix.

Verified via a scripted Playwright run against `localhost:4200` (only origin allowlisted by the API's CORS policy — other ports are blocked) with `environment.dev.ts` pointed at the real dev backend: the account-settings call now succeeds and the flow proceeds past the point where it previously failed.

### ✅ 404 blocker resolved — full flow now verified end-to-end

The `Discovery/CheckIfParticipantExists`/`InsertParticipantInAccount` 404s turned out to be two separate config bugs, both now fixed:
1. `publicApiUrl` was pointed at `dev-private-api` (copied from Discovery-App's own `base_url` field), but this SDK's endpoints actually live under **`dev-public-api`** on the same `devapimanagementenvironment` host — confirmed by testing both paths directly (`dev-private-api` → 404 "Resource not found"; `dev-public-api` → 401, i.e. the route exists). Fixed in `environment.ts` and `environment.dev.ts`.
2. The static `subscriptionKey` in `app.component.ts`'s `STATIC_PARAMS` (`da59702a...`) was only valid for UAT (`apimuatenvironment`), not this dev host — swapped to a working dev subscription key.

With both fixed, a full scripted run (`accountId 1244` / `selfRegistrationId 145`) went **all the way through**: account-settings → user-exists → discovery-status → landed on the Instructions page and successfully continued into the questionnaire. Three real endpoints confirmed live, all returning clean `200` bodies with **no `statusCode` field**:
- `Accounts/GetAccountDetailsByAccountIdandSelfregId` → `{"message":"Success","data":{...}}`
- `Discovery/CheckIfParticipantExists` → `{"personId":...,"creditId":...,"questionPattern":...}` (no envelope at all)
- `Discovery/GetDiscoveryStatus` → `{"message":"Success","data":{"q11Model":{...},"q17Model":{...},"q46Model":{...}}}`

`instructions.component.ts:352`'s discovery-status check (`statusRes.status === 200`, the real HTTP status — not `body.statusCode`) was already correct and needed no change.

### ✅ BDNA report — live-verified, renders correctly

By the time this was revisited, the same test account (`accountId 1244`/`selfRegistrationId 145`, personId `e64db70a-c096-4a4b-9fe2-bbe23497072c`) had its discovery marked complete (`GetDiscoveryStatus` → `q11Model.completed: true`), so the dashboard → "View Report" → `/bdna-report` flow was reachable directly, no need to script through the 17 questions.

Confirmed live: `Discovery/GetBDNADashboardSetting/145/1244` → `200` `{"message":"Success","data":{...}}`, no `statusCode` field — exactly the pattern the fix assumed. The rendered "Work Talent Report" page shows correct data end-to-end: participant name, DNA result ("You Are A Facilitator"), the contrasting-work-talents chart with correct percentages, page numbers, dates. No console errors from the fixed code path. Locked/greyed sections on the page are legitimate permission gating from `GetBDNADashboardSetting`'s response (`isPGuide: false`, `isDesiredTaskBasedTalent: false`), not a bug.

### FDNA report — endpoint confirmed live, page itself not reachable (unrelated reason)

`dashboard.component.ts` only routes to `/fdna-report` when `discoveryType === 'Investor'` (`dashboard.component.ts:366-370`); this test account's `discoveryType` is `WorkTalent`, so the report page itself can't be reached without an Investor-type test account, which wasn't available. This is existing business logic, unrelated to the fix.

However, the exact endpoint `fdna-reports.component.ts` calls — `Discovery/GetFDNADashboardSetting/145/1244` — was captured live during the same dashboard load and returned the identical clean pattern: `200` `{"message":"Success","data":{...}}`, no `statusCode` field. Given this and the BDNA page's confirmed correct rendering with the same code shape, the FDNA fix is considered effectively verified at the API-contract level; only the page's own rendering logic (which mirrors BDNA's) remains unconfirmed by an actual screenshot. Recommend a quick visual check with an Investor-type test account when one becomes available, but this is no longer a meaningful risk.

## Step-by-step plan — status

### 1. Mixpanel: add dev-mode logging — ✅ done
File: `src/app/services/mixpanel/mixpanel.service.ts`. Used `isDevMode()` from `@angular/core` instead of `environment.production` (this repo's environment files don't have that field).

### 2. Per-endpoint verification — ✅ done (3/4 live, 1/4 by inference)

| Call site | Result |
|---|---|
| `instructions.component.ts` `getAccountSettings` (`GET_ACCOUNT_SETTINGS`) | ✅ Live-confirmed: no `statusCode` on dev; old envelope on UAT/QA/sandbox |
| `instructions.component.ts` `createUser` (`CREATE_PARTICIPANT_ACCOUNT`) | ✅ Live-confirmed same pattern (not in original list, found during live testing) |
| `instructions.component.ts:352` discovery status call (`GET_DISCOVERY_STATUS`) | ✅ Live-confirmed: already used real HTTP `status`, not body `statusCode` — no change needed |
| `bdna-reports.component.ts:203` / `fdna-reports.component.ts:208` | ⚠️ Fixed by inference (3/3 consistent pattern elsewhere), not independently live-verified — see note above |

### 3. Component layer: replace `statusCode` branch with success/failure split — ✅ done

Applied pattern (slightly simpler than originally planned, since this repo's `NetworkService`/`apiErrorInterceptor` already guarantees any `next()` callback is a genuine success — no separate data/statusCode branching needed, just read `res.body?.data ?? res.body`):
```ts
this.service.call(...).subscribe({
  next: (res: any) => {
    const data = res.body?.data ?? res.body;
    // success path — a real failure never reaches here
  },
  error: (err) => this.handleApiError(err, 'contextName'), // or equivalent
});
```
Fixed in: `instructions.component.ts` (`getAccountSettings`, `createUser`), `bdna-reports.component.ts`, `fdna-reports.component.ts`.

### 4. Mixpanel `'<Feature> Failed'` events — already present, no change needed

`bdna-reports.component.ts`/`fdna-reports.component.ts` already route every `error:` callback through a shared `handleApiError(error, context)` helper that tracks a generic `'API_ERROR'` Mixpanel event with `{context, status, message}` — functionally equivalent to Discovery-App's per-feature `'<Feature> Failed'` events, just consolidated under one event name with a `context` field instead of one event name per feature. Left as-is rather than renamed, since it's an existing, working convention in this repo and renaming isn't required by the plan's actual goal (surfacing failures with message/status).

### 5. Regression check on `network.service.ts` — confirmed necessary, left in place

The `body.statusCode >= 400` re-throw in `handleRequest` stays. It's required for UAT/QA/sandbox (`apimuatenvironment`), which still use the old envelope; the dev backend's responses never trigger it since they don't set `statusCode`.

### 6. Testing — ✅ done for the changed component

- Existing specs (`api-error.interceptor.spec.ts`, `auth-error.interceptor.spec.ts`) needed no changes — interceptor layer untouched.
- `instructions.component.spec.ts` was rewritten with proper DI (`provideHttpClient`/`provideHttpClientTesting`/`provideRouter`, mocked `SettingsService`) and now covers `getAccountSettings()`/`createUser()` directly: a success response with no `statusCode` field resolves correctly (the regression this pass fixed), and a thrown/errored request still rejects with the expected message. 5/5 passing.
- Fixed 3 unrelated pre-existing spec failures that were blocking the *entire* suite from compiling (`app.component.spec.ts` referenced a removed `title` property; `safe.pipe.spec.ts`/`translate.pipe.spec.ts` instantiated pipes without their required constructor args). Not part of this plan's scope, but necessary to get any test signal at all.
- No specs exist yet for `bdna-reports.component.ts`/`fdna-reports.component.ts` (none existed before this pass either) — not added, since those endpoints were fixed by inference rather than live-verified (see above); adding tests that assert unverified behavior would be misleading.
- Full suite: 16/24 passing (up from 11/20 before this pass, once compilation was unblocked). The remaining 8 failures are pre-existing `NullInjectorError: No provider for HttpClient` issues in unrelated components (`DashboardComponent`, `WizardFormComponent`, `QuestionnaireComponent`, `DashboardService`) — a repo-wide test-DI gap, out of scope for this plan.
- Manual verification: done live for `instructions.component.ts`, full flow through to the Instructions/Questionnaire pages (see above). BDNA/FDNA still need an actual completed-discovery run through the UI to confirm rendering, not just the API contract.

## Generic error handling — deferred, not part of this pass

The earlier ported pieces (`ApiError`, the interceptors) only cover *normalizing* a failure. Discovery-App's actual "generic" behavior is `ApiErrorNotificationEffects` — one centralized place deciding whether/how the user sees an error, for any action app-wide. This repo still has no equivalent: `app.component.ts` and `instructions.component.ts` each hardcode an identical, byte-for-byte-duplicated `getErrorMessage()` map and inline `errorState`/navigate logic, and `bdna-reports.component.ts`/`fdna-reports.component.ts`'s `handleApiError()` silently swallows failures — neither template references the `error` field it sets, so a failed report-permissions call currently shows nothing to the user.

A first pass at closing this gap was prototyped and verified live in this session (a shared `FatalErrorService` centralizing the duplicated init-failure handling, plus PrimeNG `ToastModule`/`MessageService` wired into the BDNA/FDNA report components so failures stop being silent — confirmed working via live testing, including a forced-failure toast and, incidentally, a live-rendered FDNA report page). **That work was reverted at the user's request** to revisit later ("we do it later for messages") — not because it didn't work, but to defer the decision on message wording/approach. Revisit this section when ready to pick it back up; the approach above is a validated starting point.

## Explicitly out of scope for this port

These were bundled into Discovery-App's branch but are unrelated to error handling / Mixpanel, and should not be ported as part of this effort:
- BDNA/FDNA report component UI rewrites (`bdna-reports.component.html`, `fdna-reports.component.html`, dashboard NgRx store changes)
- Favicon/asset replacements, Unique Style SVGs
- Azure Table Storage integration (`azureTableUrl`, `azureSharedAccessKey`) — already present in this repo's `network-constants.ts`/`environment.ts` independently
- GoDNA account redirect modal, subscription-status validation modal
- Legacy `src/Network/api-constants.ts`-equivalent cleanup — this repo doesn't have that dead file
