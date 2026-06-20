import { test, expect } from '@playwright/test';

const ENDPOINT = '/authenticate';
const VALID_CREDENTIALS = { username: process.env.TEST_USERNAME!, password: process.env.TEST_PASSWORD! };
const INVALID_CREDENTIALS = { username: process.env.TEST_USERNAME!, password: 'wrongpassword' };

test.describe('Login API (/authenticate)', () => {
  test('valid credentials redirect to /secure', async ({ request }) => {
    const response = await request.post(ENDPOINT, {
      form: VALID_CREDENTIALS,
      maxRedirects: 0,
    });

    expect(response.status()).toBe(303);
    expect(response.headers()['location']).toContain('/secure');
  });

  test('valid credentials land on /secure with success flash message', async ({ request }) => {
    const response = await request.post(ENDPOINT, { form: VALID_CREDENTIALS });

    expect(response.status()).toBe(200);
    expect(response.url()).toContain('/secure');
    expect(await response.text()).toContain('You logged into a secure area!');
  });

  test('invalid credentials redirect to /login', async ({ request }) => {
    const response = await request.post(ENDPOINT, {
      form: INVALID_CREDENTIALS,
      maxRedirects: 0,
    });

    expect(response.status()).toBe(303);
    expect(response.headers()['location']).toContain('/login');
  });

  test('invalid credentials land on /login with error flash message', async ({ request }) => {
    const response = await request.post(ENDPOINT, { form: INVALID_CREDENTIALS });

    expect(response.status()).toBe(200);
    expect(response.url()).toContain('/login');
    expect(await response.text()).toContain('Your password is invalid!');
  });
});
