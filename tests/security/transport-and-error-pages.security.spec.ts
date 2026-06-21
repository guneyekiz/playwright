import { test, expect } from '@playwright/test';

// Confirmed live (2026-06-21): a plain http:// request to the app's host is served
// directly with a 200 and no redirect to https:// - there's no HSTS header and no
// HTTP->HTTPS upgrade enforced server-side. This is a real (if low-severity, given
// the public demo nature of the target) finding worth a permanent regression check.
// If Heroku's routing/SSL setup ever starts enforcing HTTPS (a positive change), this
// test will fail and need updating to assert the new (better) behavior instead.
test.describe('transport security', () => {
  test('plain HTTP is served directly instead of being redirected to HTTPS', async ({ request, baseURL }) => {
    const httpUrl = baseURL!.replace(/^https:\/\//, 'http://');

    const response = await request.get(httpUrl, { maxRedirects: 0 });

    expect(response.status()).toBe(200);
    expect(response.headers()['strict-transport-security']).toBeUndefined();
  });
});

// Confirmed live (2026-06-21): /status_codes/500 (and the other status sub-pages)
// return only the site's own templated "This page returned a 500 status code" markup
// - no stack trace, internal file path, or framework/server version banner in the
// response body.
test.describe('status/error pages do not leak internals', () => {
  test('the 500 status page returns a generic body with no stack trace or internal paths', async ({ request }) => {
    const response = await request.get('/status_codes/500');
    const body = await response.text();

    expect(response.status()).toBe(500);
    expect(body).toContain('This page returned a 500 status code');
    expect(body).not.toMatch(/at\s+.+\.(rb|js|ts):\d+/i);
    expect(body).not.toMatch(/Traceback|Exception in thread|node_modules[\\/]/i);
  });
});
