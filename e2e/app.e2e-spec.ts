import { eCommerceProjectTemplatePage } from './app.po';

describe('eCommerceProject App', function() {
  let page: eCommerceProjectTemplatePage;

  beforeEach(() => {
    page = new eCommerceProjectTemplatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
