import { Kbd } from '@/design-system/ui/kbd';

import { Figure } from './figure';
import { Iframe } from './iframe';
import { Reminder } from './reminder';
import { Tweet } from './tweet';
import { Video } from './video';
import { YouTube } from './you-tube';

/**
 * The only components an MDX content can use: any other one fails the compilation of the content,
 * and therefore the validation of the contents. Whatever the markdown already renders (quotes, code, mermaid
 * diagrams) is written in markdown, the same way as in a `.md` content.
 */
export const mdxComponents = {
  Figure,
  Iframe,
  Kbd,
  Reminder,
  Tweet,
  Video,
  YouTube,
};
