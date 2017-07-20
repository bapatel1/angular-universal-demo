import { AngularCliDemoPage } from './app.po';

describe('angular-cli-demo App', () => {
  let page: AngularCliDemoPage;

  beforeEach(() => {
    page = new AngularCliDemoPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
