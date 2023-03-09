import './Blockquote.scss';

import { AsProps, Box, ColorSystemProps, MarginSystemProps } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export type BlockquoteProps = AsProps<'blockquote'> & MarginSystemProps & Pick<ColorSystemProps, 'bg'>;

export const Blockquote: React.FC<BlockquoteProps> = (props) => (
  <Box {...(props as AsProps)} as="blockquote" className={classNames('blockquote', props.className)} />
);
