import { enhanceStickyHeader } from './stickyHeaderHelper';

describe('enhanceStickyHeader', () => {
  let cleanup: () => void;
  const HEADER_HEIGHT = 80;
  let smallScreen = true;
  let now = 0;

  const scrollTo = (scrollY: number): void => {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY });
    window.dispatchEvent(new Event('scroll'));
  };
  const getHeaderContainer = (): HTMLElement => document.getElementById('header') as HTMLElement;
  const getOffset = (): string => document.documentElement.style.getPropertyValue('--sticky-header-offset');

  beforeEach(() => {
    smallScreen = true;
    now = 0;
    vi.spyOn(Date, 'now').mockImplementation(() => now);
    // Run at once, and hand back no id so that the next scroll is not taken for a pending frame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0);
      return undefined as unknown as number;
    });
    vi.spyOn(window, 'matchMedia').mockImplementation(
      (query) =>
        ({
          get matches() {
            return smallScreen;
          },
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        }) as unknown as MediaQueryList
    );
    document.body.innerHTML =
      '<div id="header"><header>' +
      '<div data-header-menu style="display: none"></div><div data-header-search style="display: none"></div>' +
      '</header></div>' +
      '<a id="anchor" href="#section">Section</a>';
    Object.defineProperty(document.querySelector('header'), 'offsetHeight', { value: HEADER_HEIGHT });
    scrollTo(0);
    cleanup = enhanceStickyHeader();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('should hide the header while reading down and show it back when scrolling up', () => {
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(false);
    expect(getOffset()).toBe(`${HEADER_HEIGHT}px`);

    scrollTo(500);
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(true);
    expect(getOffset()).toBe('0px');

    scrollTo(450);
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(false);
    expect(getOffset()).toBe(`${HEADER_HEIGHT}px`);
  });

  it('should ignore the small jitters of the finger', () => {
    scrollTo(500);
    scrollTo(495);
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(true);
  });

  it('should keep the header while the menu is open', () => {
    (document.querySelector('[data-header-menu]') as HTMLElement).style.display = 'flex';
    scrollTo(500);
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(false);
  });

  it('should keep the header while the search field is open', () => {
    (document.querySelector('[data-header-search]') as HTMLElement).style.display = 'block';
    scrollTo(500);
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(false);
  });

  it('should not bring the header back over the target of an anchor', () => {
    scrollTo(5000);
    document.getElementById('anchor')!.click();
    scrollTo(1000);
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(true);

    now = 2000;
    scrollTo(900);
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(false);
  });

  it('should leave the header alone on large screens', () => {
    smallScreen = false;
    scrollTo(500);
    expect(getHeaderContainer().hasAttribute('data-hidden')).toBe(false);
    expect(getOffset()).toBe('0px');
  });
});
