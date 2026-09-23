import { getUrl } from '@/helpers/getUrlHelper';

import { getRedirectHtml } from './generateRedirectFiles';

describe('getRedirectHtml', () => {
  it('should redirect at once to the section and declare the tutorial page as canonical', () => {
    const html = getRedirectHtml({ lang: 'fr', to: '/fr/tutorial-1/#tutorial-step' });

    expect(html).toContain('<html lang="fr">');
    expect(html).toContain(`<link rel="canonical" href="${getUrl('/fr/tutorial-1/')}">`);
    expect(html).toContain('<meta http-equiv="refresh" content="0; url=/fr/tutorial-1/#tutorial-step">');
    expect(html).toContain('<script>window.location.replace("/fr/tutorial-1/#tutorial-step");</script>');
  });
});
