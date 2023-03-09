import './Container.scss';

import { Box, BoxProps } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export const Container: React.FC<BoxProps> = (props) => (
  <Box {...props} className={classNames('container', props.className)} />
);
