// Below this width the header follows the reader, see `#header` in useLayoutTemplateContainer
const SMALL_SCREEN_QUERY = '(width < 1001px)';
// A scroll shorter than this is a jitter of the finger, it does not toggle the header
const SCROLL_THRESHOLD = 8;
// Jumping to an anchor scrolls the page on its own: the header must not come back over the target meanwhile
const ANCHOR_SCROLL_DURATION = 1000;

/**
 * On small screens the header hides while reading down and comes back as soon as the reader scrolls up,
 * so that the menu is always one gesture away. Its visible height is shared through
 * `--sticky-header-offset`, which the elements that also stick to the top, like the summary bar, sit below.
 */
export const enhanceStickyHeader = (): (() => void) => {
  const headerContainer = document.getElementById('header');
  const header = headerContainer?.querySelector('header');
  if (!headerContainer || !header) {
    return () => undefined;
  }

  const smallScreen = window.matchMedia(SMALL_SCREEN_QUERY);
  let lastScrollY = window.scrollY;
  let anchorScrollUntil = 0;
  let animationFrame: number | undefined;

  const setHidden = (hidden: boolean): void => {
    headerContainer.toggleAttribute('data-hidden', hidden);
    document.documentElement.style.setProperty(
      '--sticky-header-offset',
      hidden || !smallScreen.matches ? '0px' : `${header.offsetHeight}px`
    );
  };

  const isMenuOpen = (): boolean => {
    const menu = header.querySelector<HTMLElement>('[data-header-menu]');
    return !!menu && window.getComputedStyle(menu).display !== 'none';
  };

  const update = (): void => {
    animationFrame = undefined;
    const scrollY = Math.max(0, window.scrollY);
    const delta = scrollY - lastScrollY;

    if (!smallScreen.matches || scrollY <= header.offsetHeight || isMenuOpen()) {
      setHidden(false);
    } else if (delta > SCROLL_THRESHOLD || (delta < 0 && Date.now() < anchorScrollUntil)) {
      setHidden(true);
    } else if (delta < -SCROLL_THRESHOLD) {
      setHidden(false);
    } else {
      return;
    }
    lastScrollY = scrollY;
  };

  const onScroll = (): void => {
    if (animationFrame === undefined) {
      animationFrame = window.requestAnimationFrame(update);
    }
  };

  const onClick = (event: MouseEvent): void => {
    if ((event.target as HTMLElement).closest('a[href^="#"]')) {
      anchorScrollUntil = Date.now() + ANCHOR_SCROLL_DURATION;
    }
  };
  const onScreenChange = (): void => setHidden(false);

  document.addEventListener('click', onClick);
  window.addEventListener('scroll', onScroll, { passive: true });
  smallScreen.addEventListener('change', onScreenChange);
  setHidden(false);

  return (): void => {
    document.removeEventListener('click', onClick);
    window.removeEventListener('scroll', onScroll);
    smallScreen.removeEventListener('change', onScreenChange);
  };
};
