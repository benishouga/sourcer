import puppeteer from 'puppeteer';

export const sel = (id: string) => `[data-test="${id}"]`;
export const wait = (mills = 100) => new Promise(resolve => setTimeout(resolve, mills));

export class Facades {
  constructor(private page: puppeteer.Page) {}

  public async createAccount(accountName: string, accountPassword: string) {
    const page = this.page;
    await page.goto('http://localhost:5000/signup');
    await page.waitForSelector(sel('page-sign-up'));
    const account = await page.$(sel('account'));
    const password = await page.$(sel('password'));
    const name = await page.$(sel('name'));
    const signUp = await page.$(sel('signUp'));
    if (!account || !password || !name || !signUp) {
      console.error('createAccount failed');
      throw new Error();
    }
    await account.type(accountName);
    await password.type(accountPassword);
    await name.type(accountName);
    await signUp.click();
    await page.waitForSelector(sel('page-top'));
  }

  public async login(accountName: string, accountPassword: string) {
    const page = this.page;
    await page.goto('http://localhost:5000/login');
    await page.waitForSelector(sel('page-login'));
    const account = await page.$(sel('account'));
    const password = await page.$(sel('password'));
    const login = await page.$(sel('login'));
    if (!account || !password || !login) {
      console.error('login failed');
      throw new Error();
    }
    await account.type(accountName);
    await password.type(accountPassword);
    await login.click();
    await page.waitForSelector(sel('page-top'));
  }

  public async logout() {
    const page = this.page;
    await page.goto('http://localhost:5000/logout');
    await page.waitForSelector(sel('page-logout'));
  }
}
