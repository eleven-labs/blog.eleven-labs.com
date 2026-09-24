import GithubSlugger from 'github-slugger';

import { mdxToHtml } from '@/helpers/markdownToHtmlHelper';

describe('remarkSectionHeadingsPlugin', () => {
  const getSlugger = (reservedSlugs: string[] = []): GithubSlugger => {
    const slugger = new GithubSlugger();
    reservedSlugs.forEach((slug) => slugger.slug(slug));
    return slugger;
  };

  it('should drop a first heading repeating the title of the section', () => {
    const html = mdxToHtml('## Création de l’application React :\n\nText', {
      section: { title: 'Creation de l’application React', slugger: getSlugger() },
    });

    expect(html).toBe('<p>Text</p>');
  });

  it('should keep a first heading that differs from the title of the section', () => {
    const html = mdxToHtml('## Pourquoi ce tutoriel ?\n\nText', {
      section: { title: 'Introduction', slugger: getSlugger() },
    });

    expect(html).toContain('<h3 id="pourquoi-ce-tutoriel-">Pourquoi ce tutoriel ?</h3>');
  });

  it('should move every heading below the h2 of the section', () => {
    const html = mdxToHtml('# One\n\n## Two\n\n### Three\n\n###### Six', {
      section: { title: 'Section', slugger: getSlugger() },
    });

    expect(html).toContain('<h3 id="one">One</h3>');
    expect(html).toContain('<h3 id="two">Two</h3>');
    expect(html).toContain('<h4 id="three">Three</h4>');
    expect(html).toContain('<h6 id="six">Six</h6>');
  });

  it('should never give a heading an id already used by a section or by another step', () => {
    const slugger = getSlugger(['introduction', 'conclusion']);
    const firstStepHtml = mdxToHtml('## Introduction\n\n## Conclusion', {
      section: { title: 'Présentation', slugger },
    });
    const secondStepHtml = mdxToHtml('## Conclusion', { section: { title: 'Fin', slugger } });

    expect(firstStepHtml).toContain('<h3 id="introduction-1">Introduction</h3>');
    expect(firstStepHtml).toContain('<h3 id="conclusion-1">Conclusion</h3>');
    expect(secondStepHtml).toContain('<h3 id="conclusion-2">Conclusion</h3>');
  });
});
