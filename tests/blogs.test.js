const Page = require('./helpers/page');

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await page.close(); 
});

describe('When logged in', () => {
  beforeEach(async () => {
    await page.login();
    await page.goto('http://localhost:3000/blogs');
    await page.click('a.btn-floating');
  });

  test('Test Add New Blog Form - Is Visible', async () => {
    const text = await page.getContentsOf('form label');
    expect(text).toEqual('Blog Title');
  });

  describe('When entering Valid inputs', () => {
    const titleInputText = 'My Title';
    const contentInputText = 'My Content';

    beforeEach(async () => {
      await page.type('.title input', titleInputText);
      await page.type('.content input', contentInputText);
      await page.click('form button');
    });

    test('Test Review Screen - Displays', async () => {
      const text = await page.getContentsOf('h5');
      expect(text).toEqual('Please confirm your entries');
    });

    test('Test Saving - Displays Blog on Page', async () => {
      await page.click('button.green');
      await page.waitForSelector('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual(titleInputText);
      expect(content).toEqual(contentInputText);
    });
  });

  describe('When entering Invalid inputs', () => {
    beforeEach(async () => {
      await page.click('form button');
    });

    test('Test Add New Blog Form - Displays Error', async () => {
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('When Not logged in', () => {

  test('Test Restrict to Create Blog', async () => {
    const result = await page.post('/api/blogs', {title: 'My Title', content: 'My Content'});
    expect(result).toEqual({ error: 'You must log in!'})
  });

  test('Test Restrict to List Blog', async () => {
    const result = await page.get('/api/blogs');
    expect(result).toEqual({ error: 'You must log in!'})
  }); 
});

describe('When Not logged in V2', () => {
  const actions = [
    {
      method: 'get',
      path: '/api/blogs'
    },
    {
      method: 'post',
      path: '/api/blogs',
      data: {
        title: 'T',
        content: 'C'
      }
    }
  ];

  test('Blog related actions are prohibited', async () => {
    const results = await page.execRequests(actions);

    for (let result of results) {
      expect(result).toEqual({ error: 'You must log in!' });
    }
  });
});