import { enhanceSummaries } from './summaryHelper';

describe('enhanceSummaries', () => {
  let cleanup: () => void;
  const sectionTops: Record<string, number> = {};

  const scrollToSection = (sectionId: string): void => {
    Object.keys(sectionTops).forEach((id, index, ids) => {
      sectionTops[id] = (index - ids.indexOf(sectionId)) * 1000;
    });
    window.dispatchEvent(new Event('scroll'));
  };
  const getStates = (): string =>
    Array.from(document.querySelectorAll<HTMLElement>('aside a[data-summary-link]'))
      .map((link) => link.dataset.state?.[0])
      .join('');

  beforeEach(() => {
    // Run at once, and hand back no id so that the next scroll is not taken for a pending frame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return undefined as unknown as number;
    });
    vi.spyOn(window, 'matchMedia').mockImplementation(
      () => ({ matches: false }) as unknown as MediaQueryList
    );
    const ids = ['introduction', 'installation', 'conclusion'];
    const links = ids
      .map((id) => `<a href="#${id}" data-summary-link="${id}" data-summary-label="Label ${id}" data-state="upcoming"></a>`)
      .join('');
    document.body.innerHTML = `
      <details data-summary-bar="secondary" open>
        <summary><span data-summary-bar-index>1</span><span data-summary-bar-label></span>
        <span data-summary-bar-progress style="width: 33%"></span></summary>
        ${links}
      </details>
      <aside>${links}</aside>
      ${ids.map((id) => `<section id="${id}"></section>`).join('')}
    `;
    for (const id of ids) {
      sectionTops[id] = 0;
      document.getElementById(id)!.getBoundingClientRect = (): DOMRect => ({ top: sectionTops[id] }) as DOMRect;
      document.getElementById(id)!.scrollIntoView = vi.fn();
    }
    scrollToSection('introduction');
    cleanup = enhanceSummaries();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should highlight the section being read in every summary', () => {
    expect(getStates()).toBe('auu');

    scrollToSection('installation');
    expect(getStates()).toBe('pau');
    expect(document.querySelector('aside [aria-current]')?.getAttribute('data-summary-link')).toBe('installation');
    expect(document.querySelector('[data-summary-bar-label]')?.textContent).toBe('Label installation');
    expect(document.querySelector('[data-summary-bar-index]')?.textContent).toBe('2');
    expect((document.querySelector('[data-summary-bar-progress]') as HTMLElement).style.width).toBe(
      `${(2 / 3) * 100}%`
    );

    scrollToSection('conclusion');
    expect(getStates()).toBe('ppa');
  });

  it('should fold the summary bar and scroll to the section chosen in it', () => {
    const bar = document.querySelector('details') as HTMLDetailsElement;
    (bar.querySelector('a[data-summary-link="conclusion"]') as HTMLAnchorElement).click();

    expect(bar.open).toBe(false);
    expect(document.getElementById('conclusion')!.scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
    expect(window.location.hash).toBe('#conclusion');
  });

  describe('in a tutorial', () => {
    beforeEach(() => {
      cleanup();
      const steps = document.createElement('div');
      steps.setAttribute('data-tutorial-steps', '');
      document.body.appendChild(steps);
      document.querySelectorAll('section').forEach((section) => steps.appendChild(section));
      document.getElementById('conclusion')!.innerHTML = '<h3 id="last-words">Last words</h3>';
      document.getElementById('last-words')!.scrollIntoView = vi.fn();
      window.location.hash = '';
      cleanup = enhanceSummaries();
    });

    it('should highlight the step displayed, whatever the scroll', () => {
      expect(getStates()).toBe('auu');

      scrollToSection('conclusion');
      expect(getStates()).toBe('auu');
    });

    it('should follow the step the anchor points to and bring the reader back to it', () => {
      window.location.hash = 'installation';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      expect(getStates()).toBe('pau');
      expect(document.getElementById('installation')!.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'instant',
        block: 'start',
      });

      window.location.hash = 'last-words';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      expect(getStates()).toBe('ppa');
    });

    it('should navigate to the step chosen in the summary bar', () => {
      const bar = document.querySelector('details') as HTMLDetailsElement;
      (bar.querySelector('a[data-summary-link="installation"]') as HTMLAnchorElement).click();

      expect(bar.open).toBe(false);
      expect(window.location.hash).toBe('#installation');
    });
  });
});
