
const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close(); 
});

test('Test Header Text', async () => {
  const text = await page.getContentsOf('a.brand-logo');
  expect(text).toEqual('Blogster');
});

test('Test Click on Login', async () => {
  await page.click('.right a');

  const url = await page.url();
  expect(url).toMatch(/accounts.google.com/);
});

test('After SingIn show Logout', async () => {
  await page.login();

  const text = await page.getContentsOf('a[href="/auth/logout"]');
  expect(text).toEqual('Logout')
});