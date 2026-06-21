import { test, expect } from '@playwright/test';

// Confirmed live against the-internet.herokuapp.com (2026-06-21): /login currently
// sends X-Frame-Options and X-Content-Type-Options, but no Content-Security-Policy,
// Strict-Transport-Security, or Referrer-Policy header. This spec documents that
// current (incomplete) header posture as a regression baseline rather than asserting
// an ideal-but-unmet state — it should start failing the moment any of these
// improves or regresses.
test.describe('response security headers (/login)', () => {
  test('sends clickjacking and MIME-sniffing protections', async ({ request }) => {
    const response = await request.get('/login');
    const headers = response.headers();

    expect(headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(headers['x-content-type-options']).toBe('nosniff');
  });

  test('does not yet send CSP, HSTS, or Referrer-Policy headers', async ({ request }) => {
    const response = await request.get('/login');
    const headers = response.headers();

    expect(headers['content-security-policy']).toBeUndefined();
    expect(headers['strict-transport-security']).toBeUndefined();
    expect(headers['referrer-policy']).toBeUndefined();
  });
});
