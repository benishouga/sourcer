import * as assert from 'assert';
import puppeteer from 'puppeteer';
import runServer, { Closable } from '../main/server/runServer';
import { sel, Facades, wait } from './E2eUtils';
import Env from '../main/server/Env';
import TestUtils from '../test/TestUtils';
import db from '../main/server/db';

describe('server', function() {
  this.timeout(20000);

  let server: Closable | null = null;
  before(async () => {
    Env.instance.mongodbUri = Env.instance.mongoTest;
    Env.instance.appKey = '';
    const mongoDbUri = Env.instance.mongoTest;
    if (!mongoDbUri) {
      throw new Error('env.MONGO_TEST is not defined.');
    }
    await db(mongoDbUri);

    server = await runServer({
      enableRequestLog: false
    });
  });

  after(async () => {
    if (server) {
      server.close();
    }
    Env.reset();
  });

  beforeEach(async () => {
    await TestUtils.clearDb();
  });

  it('login', async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 800 });
    const facade = new Facades(page);
    await facade.createAccount('user1', 'password1');
    await page.goto('http://localhost:5000/login');
    await page.waitForSelector(sel('page-login'));
    const account = await page.$(sel('account'));
    const password = await page.$(sel('password'));
    const login = await page.$(sel('login'));
    if (!account || !password || !login) {
      console.error('login failed');
      throw new Error();
    }
    await account.type('user1');
    await password.type('password1');
    await login.click();
    await page.waitForSelector(sel('page-top'));
    assert.ok(page.$(sel('page-top')));
    await wait(100);
    await browser.close();
  });

  it('top', async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 800 });
    const facade = new Facades(page);
    await facade.createAccount('user1', 'password1');
    await facade.createAccount('user2', 'password2');
    await facade.login('user1', 'password1');
    await page.goto('http://localhost:5000/');
    await page.waitForSelector(sel('page-top'));
    assert.ok(page.$(sel('page-top')));
    await wait(100);
    await browser.close();
  });

  it('edit', async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1024, height: 800 });
    const facade = new Facades(page);
    await facade.createAccount('user1', 'password1');
    await facade.createAccount('user2', 'password2');
    await facade.login('user1', 'password1');
    await page.goto('http://localhost:5000/edit');
    await page.waitForSelector(sel('page-edit'));
    assert.ok(page.$(sel('page-edit')));
    await page.screenshot({ path: 'e2e/edit.png' });
    await wait(100);
    await browser.close();
  });
});
