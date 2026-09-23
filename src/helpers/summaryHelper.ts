import { getSummarySectionState } from '@/components/Molecules/Cards/SummaryCard/SummaryCard';

// A section becomes the active one once its top has gone past this distance from the top of the viewport
const ACTIVE_SECTION_OFFSET = 120;

/**
 * The post pages are not hydrated: their summaries are static HTML, whose anchor links already work without
 * JavaScript. This highlights the current section in every summary of the page, the sidebar card as well as
 * the sticky bar of the small screens:
 * - in an article, the section being read, which follows the scroll;
 * - in a tutorial, the step displayed, which follows the anchor of the url (see `[data-tutorial-steps]`).
 */
export const enhanceSummaries = (): (() => void) => {
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[data-summary-link]'));
  const sectionIds = Array.from(new Set(links.map((link) => link.dataset.summaryLink as string)));
  const sections = sectionIds
    .map((sectionId) => document.getElementById(sectionId))
    .filter((section): section is HTMLElement => section !== null);
  if (sections.length === 0) {
    return () => undefined;
  }

  const bars = Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-summary-bar]'));
  let activeSectionId: string | undefined;

  const setActiveSection = (sectionId: string): void => {
    if (sectionId === activeSectionId) {
      return;
    }
    activeSectionId = sectionId;
    const activeIndex = sectionIds.indexOf(sectionId);

    for (const link of links) {
      const state = getSummarySectionState(sectionIds.indexOf(link.dataset.summaryLink as string), activeIndex);
      link.dataset.state = state;
      if (state === 'active') {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    }

    const label = links.find((link) => link.dataset.summaryLink === sectionId)?.dataset.summaryLabel ?? '';
    for (const bar of bars) {
      bar.querySelector('[data-summary-bar-label]')!.textContent = label;
      const index = bar.querySelector('[data-summary-bar-index]');
      if (index) {
        index.textContent = String(activeIndex + 1);
      }
      const progress = bar.querySelector<HTMLElement>('[data-summary-bar-progress]');
      if (progress) {
        progress.style.width = `${((activeIndex + 1) / sectionIds.length) * 100}%`;
      }
    }
  };

  const tutorialSteps = document.querySelector<HTMLElement>('[data-tutorial-steps]');
  const getAnchorTarget = (): HTMLElement | null =>
    window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;

  let animationFrame: number | undefined;
  const updateActiveSection = (): void => {
    animationFrame = undefined;
    if (tutorialSteps) {
      // The step displayed is the one the anchor points to, or that holds its target; the first one otherwise
      const step = getAnchorTarget()?.closest<HTMLElement>('[data-tutorial-steps] > section');
      setActiveSection((step ?? sections[0]).id);
      return;
    }

    const passedSections = sections.filter((section) => section.getBoundingClientRect().top <= ACTIVE_SECTION_OFFSET);
    setActiveSection((passedSections[passedSections.length - 1] ?? sections[0]).id);
  };
  const onScroll = (): void => {
    if (animationFrame === undefined) {
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    }
  };

  // The browser scrolls to the anchor before the step it points to is displayed: the reader is brought back
  // to its target once shown, at once, as when turning a page
  const onHashChange = (): void => {
    updateActiveSection();
    getAnchorTarget()?.scrollIntoView({ behavior: 'instant', block: 'start' });
  };

  updateActiveSection();
  const pageListeners: [string, () => void][] = tutorialSteps
    ? [['hashchange', onHashChange]]
    : [
        ['scroll', onScroll],
        ['resize', onScroll],
      ];
  for (const [pageEvent, listener] of pageListeners) {
    window.addEventListener(pageEvent, listener, { passive: true });
  }

  // The section chosen in the sticky bar must stay visible: the list folds up first. Folding it during
  // the native navigation to the anchor would cancel its scroll, so the scroll is done here instead.
  const onBarClick = (event: MouseEvent): void => {
    const bar = event.currentTarget as HTMLDetailsElement;
    const link = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[data-summary-link]');
    const section = link && document.getElementById(link.dataset.summaryLink as string);
    if (!section || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    bar.open = false;
    // A tutorial displays its steps through the anchor: it must be navigated to, so that `:target` follows
    if (tutorialSteps && window.location.hash !== `#${section.id}`) {
      window.location.hash = section.id;
      return;
    }
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
    if (window.location.hash !== `#${section.id}`) {
      window.history.pushState(window.history.state, '', `#${section.id}`);
    }
  };
  for (const bar of bars) {
    bar.addEventListener('click', onBarClick);
  }

  return (): void => {
    for (const [pageEvent, listener] of pageListeners) {
      window.removeEventListener(pageEvent, listener);
    }
    for (const bar of bars) {
      bar.removeEventListener('click', onBarClick);
    }
  };
};
