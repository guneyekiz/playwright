# App Exploration: the-internet.herokuapp.com

## Overview

This document captures a manual/exploratory QA pass over the full target application used by this repo's automated suite: [the-internet.herokuapp.com](https://the-internet.herokuapp.com), a public QA practice site maintained for testers and tool authors to exercise against. The site intentionally contains broken images, randomized typos, mixed-content warnings, and other contrived quirks for demonstration purposes — these are called out below as "intentional demo," not as defects.

- **Exploration date:** 2026-06-21
- **Scope:** the `/login` golden path (already covered by this repo's automated suite) plus every one of the ~44 example feature links listed on the homepage (`/`).
- **Method:** headed Chromium via a throwaway Playwright script (`test-results/manual/`, deleted after use per repo convention), driven against `BASE_URL`/`TEST_USERNAME`/`TEST_PASSWORD` from `.env.dev`. Console messages and page errors were captured on every page visited.
- **Not in scope:** exhaustive input fuzzing, cross-browser passes, or deep multi-step flows beyond a single representative interaction per page.

## Golden path (already automated)

Logged in at `/login` with valid credentials from `.env.dev` → landed on `/secure` with flash message "You logged into a secure area!" → clicked Logout → landed back on `/login` with flash message "You logged out of the secure area!". Both worked as expected, no issues. This confirms the existing automated suite's coverage of this flow is still valid.

## Feature pages visited

| # | Name | Path | What it demonstrates |
|---|------|------|----------------------|
| 1 | A/B Testing | `/abtest` | Randomly serves one of two heading variants per visit (classic A/B test demo). |
| 2 | Add/Remove Elements | `/add_remove_elements/` | Dynamically adds/removes DOM nodes via JS button clicks. |
| 3 | Basic Auth | `/basic_auth` | HTTP Basic Authentication challenge. |
| 4 | Broken Images | `/broken_images` | Page with some `<img>` tags pointing at missing resources (intentional). |
| 5 | Challenging DOM | `/challenging_dom` | Elements with non-deterministic/regenerating class names and IDs, a known pain point for brittle CSS selectors. |
| 6 | Checkboxes | `/checkboxes` | Two checkboxes, one pre-checked, for basic checkbox interaction. |
| 7 | Context Menu | `/context_menu` | Right-click on a hotspot triggers a native JS `alert()`. |
| 8 | Digest Authentication | `/digest_auth` | HTTP Digest Authentication challenge (requires the site's own documented `admin`/`admin` creds, not app creds). |
| 9 | Disappearing Elements | `/disappearing_elements` | Nav menu items that randomly disappear/reappear on reload (intentional). |
| 10 | Drag and Drop | `/drag_and_drop` | Two boxes (A/B) draggable via native HTML5 drag-and-drop. |
| 11 | Dropdown | `/dropdown` | Plain `<select>` element, basic dropdown interaction. |
| 12 | Dynamic Content | `/dynamic_content` | Page content (text/images) that changes on each reload. |
| 13 | Dynamic Controls | `/dynamic_controls` | Buttons that enable/disable a checkbox or show/hide an input field with a simulated delay. |
| 14 | Dynamic Loading | `/dynamic_loading` | Landing page linking to two sub-examples of elements that render after a delay (one hidden-then-shown, one rendered-from-nothing). |
| 15 | Entry Ad | `/entry_ad` | Modal "ad" that pops up automatically shortly after page load. |
| 16 | Exit Intent | `/exit_intent` | Modal that's meant to trigger when the mouse leaves the top of the viewport (exit-intent pattern). |
| 17 | File Download | `/download` | Lists files in a directory, each downloadable via a direct link. |
| 18 | File Upload | `/upload` | Standard file input + drag-and-drop upload form. |
| 19 | Floating Menu | `/floating_menu` | Nav menu that stays fixed/visible while scrolling. |
| 20 | Forgot Password | `/forgot_password` | Email input + submit button (no real password-reset email is sent). |
| 21 | Form Authentication | `/login` | The login flow already covered above. |
| 22 | Frames | `/frames` | Landing page linking to nested-frames and a WYSIWYG iframe editor. |
| 23 | Geolocation | `/geolocation` | Requests the browser Geolocation API and displays returned coordinates. |
| 24 | Horizontal Slider | `/horizontal_slider` | `<input type="range">` slider, value displayed live. |
| 25 | Hovers | `/hovers` | Three avatar images that reveal a caption/link overlay on hover. |
| 26 | Infinite Scroll | `/infinite_scroll` | Page that appends more paragraphs as the user scrolls down. |
| 27 | Inputs | `/inputs` | A single `<input type="number">` field for numeric input testing. |
| 28 | JQuery UI Menus | `/jqueryui/menu` | A jQuery UI-powered nested menu widget. |
| 29 | JavaScript Alerts | `/javascript_alerts` | Buttons that trigger native `alert()`, `confirm()`, and `prompt()` dialogs. |
| 30 | JavaScript onload event error | `/javascript_error` | Intentionally throws an uncaught JS error on page load (demo of error monitoring). |
| 31 | Key Presses | `/key_presses` | Displays which key was last pressed inside a focused input. |
| 32 | Large & Deep DOM | `/large` | A large table (dozens of rows) for DOM-size/performance testing. |
| 33 | Multiple Windows | `/windows` | A link that opens a new browser tab/window. |
| 34 | Nested Frames | `/nested_frames` | A frameset containing multiple nested `<frame>` elements. |
| 35 | Notification Messages | `/notification_message` | A button that shows a randomized flash notification (text and styling vary per click — intentional). |
| 36 | Redirect Link | `/redirector` | A link that performs a server-side redirect to `/status_codes`. |
| 37 | Secure File Download | `/download_secure` | Same as File Download but behind HTTP Basic Auth. |
| 38 | Shadow DOM | `/shadowdom` | A `<ul>` of list items rendered inside a Shadow DOM root, for testing shadow-piercing locators. |
| 39 | Shifting Content | `/shifting_content` | Landing page linking to menu/image/text examples whose layout shifts on reload (intentional layout-shift demo). |
| 40 | Slow Resources | `/slow` | A page with a deliberately slow-loading image, for testing slow-network handling. |
| 41 | Sortable Data Tables | `/tables` | Two tables with sortable columns (by header click). |
| 42 | Status Codes | `/status_codes` | Links to pages that return 200/301/404/500 status codes directly. |
| 43 | Typos | `/typos` | Body text that randomly contains a typo on reload (intentional, for visual-diff/proofreading demos). |
| 44 | WYSIWYG Editor | `/tinymce` | An embedded TinyMCE rich-text editor (cloud-hosted, license-gated — see Finding 5). |

## Findings

1. **(Observation)** Every single page on the site fires a `net::ERR_NAME_NOT_RESOLVED` console error for an Optimizely analytics beacon (`*.log.optimizely.com`). This is a third-party tracking call being blocked/unreachable in the test environment, not an application defect — it does not affect any page's functionality. Worth knowing about so it isn't mistaken for a real failure when asserting "no console errors" in future specs.

2. **(Bug, low severity)** `/broken_images` and `/forgot_password` each surface one or two genuine HTTP-level resource failures beyond the analytics noise: `/broken_images` logs `404 Not Found` for the (intentionally) broken `<img>` sources, which is expected/by design for that page's whole premise. `/forgot_password`, however, returns a real **500 Internal Server Error** when the form is submitted with a test email address (`Failed to load resource: the server responded with a status of 500`). The page still renders a generic response and stays on `/forgot_password`, so it's not a hard crash, but the server-side handler for this demo form appears to error out server-side on submission. Screenshot not captured (text-only), but reproducible by filling `#email` and clicking submit.

3. **(Bug, low severity)** `/javascript_error` throws a genuine uncaught page error on load: `Cannot read properties of undefined (reading 'xyz')`. This is clearly the intentional point of the page (it's literally named "JavaScript onload event error" and exists to demonstrate this exact error for error-monitoring-tool demos), so it's flagged here for completeness rather than as an actionable defect.

4. **(Observation, intentional)** `/jqueryui/menu` and `/tinymce` both load insecure/legacy third-party dependencies: `/jqueryui/menu` triggers **mixed-content warnings** (it requests `http://ajax.googleapis.com/...jquery...` and `...jquery-ui...` over plain HTTP from an HTTPS page, which Chromium blocks), and also has a broken stylesheet MIME-type error for `css/styles.css`. `/tinymce` logs a TinyMCE "read-only mode" console warning because the demo site's free-tier cloud API key has exhausted its monthly editor-load quota. Both are infrastructure/dependency-age issues on the demo site itself, not something the repo's tests should chase, but worth knowing if a future spec asserts on TinyMCE editability or jQuery UI menu interactivity — those specific behaviors may currently be broken upstream.

5. **(Observation)** `/basic_auth` and `/download_secure` cannot be navigated to directly via Playwright's `page.goto()` with credentials embedded in the URL (`https://user:pass@host/path`) — Chromium rejects this with `net::ERR_INVALID_AUTH_CREDENTIALS` in this environment. The reliable approach is `browser.newContext({ httpCredentials: { username, password } })`, which worked cleanly. This isn't an app bug, but it's a real gotcha worth documenting for whoever builds a Basic-Auth-flow spec — see "Worth automating" below.

6. **(Quirk, intentional)** `/abtest`, `/disappearing_elements`, `/notification_message`, and `/typos` all return different content on each page load/visit by design (A/B variant, randomly-missing nav item, randomized flash message text/style, randomly-introduced typo respectively). Any future spec touching these pages needs to assert on structure/presence rather than exact text, or it will be flaky by the site's own design.

7. **(Observation)** `/dynamic_loading` is a landing/index page (lists "Example 1" and "Example 2" links) rather than the interactive widget itself — unlike `/dynamic_controls`, which goes straight to the widget. Easy to conflate the two when skimming the homepage list; no bug, just worth noting for anyone writing specs against "dynamic loading."

8. **(No issues found)** The following pages behaved exactly as their description promises with no console/page errors beyond the universal Optimizely noise: Add/Remove Elements, Challenging DOM, Checkboxes, Context Menu, Drag and Drop (note: HTML5 drag-and-drop via raw synthetic mouse events is unreliable across browsers in general — this is a known Playwright/automation limitation, not a site bug), Dropdown, Dynamic Content, Dynamic Controls, File Download, File Upload, Floating Menu, Frames, Geolocation, Horizontal Slider, Hovers, Infinite Scroll, Inputs, JavaScript Alerts, Key Presses, Large & Deep DOM, Multiple Windows, Nested Frames, Redirect Link, Shadow DOM, Shifting Content, Slow Resources, Sortable Data Tables, Status Codes.

9. **(Observation, intentional)** `/broken_images` visually shows 2 of 4 images broken (missing/red-X placeholders) — this is the entire point of the page. Screenshot: `test-results/manual/screenshots/broken_images.png`.

10. **(Observation, intentional)** `/challenging_dom` renders fine visually; its buttons/table cells have CSS class names and an HTML table `id` that regenerate on every page reload, by design. Screenshot: `test-results/manual/screenshots/challenging_dom.png`.

11. **(Observation, intentional)** `/typos` renders a short paragraph that may or may not contain a deliberately introduced spelling error, randomized per load. Screenshot: `test-results/manual/screenshots/typos.png`.

12. **(Observation, intentional)** `/entry_ad` shows an auto-popping modal advertisement shortly after load (it did not appear within the short 300ms wait used for the screenshot in this pass — it appears on a short delay, so timing-sensitive specs should explicitly wait for `.modal` visibility rather than assuming it's instant). Screenshot: `test-results/manual/screenshots/entry_ad_modal.png` (captured before the modal had appeared in this run).

13. **(Observation, intentional)** `/exit_intent`'s modal is triggered by a `mouseleave` event on the document specifically exiting through the top of the viewport — a synthetic `page.mouse.move()` to y=0 did not reliably trigger it in this pass (modal not visible at screenshot time), suggesting the trigger depends on actual viewport-boundary mouseleave semantics that a simple coordinate move doesn't replicate. Screenshot: `test-results/manual/screenshots/exit_intent_modal.png`.

## Worth automating

Candidates for new Playwright specs to hand to `playwright-builder`:

- **Basic Auth flow** (`/basic_auth`): a spec using `browser.newContext({ httpCredentials })` to verify successful auth, plus a negative case with wrong credentials. Document the URL-embedded-credentials gotcha (Finding 5) directly in the spec/page-object comments so it isn't rediscovered.
- **JavaScript Alerts** (`/javascript_alerts`): straightforward, deterministic, and a good fit for asserting all three dialog types (alert/confirm/prompt) and their resulting result text.
- **Dynamic Loading / Dynamic Controls** (`/dynamic_loading`, `/dynamic_controls`): good candidates for testing proper use of web-first assertions/auto-waiting instead of arbitrary timeouts, since both involve genuine async delays.
- **Status Codes** (`/status_codes`): easy, deterministic way to assert on HTTP response codes for 200/301/404/500 sub-pages.
- **Dropdown / Checkboxes / Horizontal Slider / Inputs**: low-risk, stable, good "fundamentals" coverage for form-control interaction patterns if the suite wants broader coverage beyond login.
- **Forgot Password** (`/forgot_password`): worth a regression spec specifically asserting on the current 500 error response (Finding 2) so any future fix or regression is caught — frame it as documenting current (possibly buggy) behavior rather than asserting success.

Not recommended for automation: pages whose entire premise is randomized/non-deterministic per load (A/B Testing, Disappearing Elements, Notification Messages, Typos, Dynamic Content) — these would need assertions scoped to "is structurally present" rather than exact content, and add little value over manual exploration given how small/stable the rest of the site is.

## Screenshots

All under `test-results/manual/screenshots/`:
- `broken_images.png` — Finding 9
- `challenging_dom.png` — Finding 10
- `typos.png` — Finding 11
- `entry_ad_modal.png` — Finding 12
- `exit_intent_modal.png` — Finding 13
