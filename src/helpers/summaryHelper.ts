import { getSummarySectionState } from '@/components/Molecules/Cards/SummaryCard/SummaryCard';

// A section becomes the active one once its top has gone past this distance from the top of the viewport
const ACTIVE_SECTION_OFFSET = 120;

/**
 * The post pages are not hydrated: their summaries are static HTML, whose anchor links already work without
 * JavaScript. This follows the section being read to highlight it in every summary of the page, the
 * sidebar card as well as the sticky bar of the small screens.
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

  let animationFrame: number | undefined;
  const updateActiveSection = (): void => {
    animationFrame = undefined;
    const passedSections = sections.filter((section) => section.getBoundingClientRect().top <= ACTIVE_SECTION_OFFSET);
    setActiveSection((passedSections[passedSections.length - 1] ?? sections[0]).id);
  };
  const onScroll = (): void => {
    if (animationFrame === undefined) {
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    }
  };

  updateActiveSection();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

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
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
    for (const bar of bars) {
      bar.removeEventListener('click', onBarClick);
    }
  };
};
