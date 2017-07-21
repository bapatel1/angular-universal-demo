import { Ng4UniversalPage } from './app.po';

describe('ng4-universal App', () => {
  let page: Ng4UniversalPage;

  beforeEach(() => {
    page = new Ng4UniversalPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
