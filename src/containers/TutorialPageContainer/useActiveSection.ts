import { useEffect, useState } from 'react';

// A section becomes the active one once its top has gone past this distance from the top of the viewport
const ACTIVE_SECTION_OFFSET = 120;

/**
 * Follows the section being read. The server does not know where the reader is: it renders the first
 * section as active, and the browser takes over once the page is hydrated.
 */
export const useActiveSection = (sectionIds: string[]): string | undefined => {
  const [activeSectionId, setActiveSectionId] = useState<string | undefined>(sectionIds[0]);
  const sectionIdsKey = sectionIds.join(',');

  useEffect(() => {
    const ids = sectionIdsKey.split(',');
    let animationFrame: number | undefined;

    const updateActiveSection = (): void => {
      animationFrame = undefined;
      const passedSectionIds = ids.filter((sectionId) => {
        const section = document.getElementById(sectionId);
        return section && section.getBoundingClientRect().top <= ACTIVE_SECTION_OFFSET;
      });
      setActiveSectionId(passedSectionIds[passedSectionIds.length - 1] ?? ids[0]);
    };

    const onScroll = (): void => {
      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(updateActiveSection);
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return (): void => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [sectionIdsKey]);

  return activeSectionId;
};

/**
 * The links of the summary and of the step navigation are plain anchors, which already work without
 * JavaScript. Once hydrated, they scroll smoothly to the section and keep its fragment in the history.
 */
export const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string): void => {
  const section = document.getElementById(sectionId);
  if (!section || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }

  event.preventDefault();
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  section.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
  if (window.location.hash !== `#${sectionId}`) {
    window.history.pushState(window.history.state, '', `#${sectionId}`);
  }
};
