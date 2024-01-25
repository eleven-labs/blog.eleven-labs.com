import './TutoTag.scss';

import { Flex, FlexProps, Icon, Text } from '@eleven-labs/design-system';
import classNames from 'classnames';
import React from 'react';

export type TutoTagOptions = {
  label?: string;
};

export type TutoTagProps = FlexProps & TutoTagOptions;

export const TutoTag: React.FC<TutoTagProps> = ({ label, className, ...props }) => (
  <Flex {...props} display="inline-flex" alignItems="center" bg="azure" className={classNames('tuto-tag', className)}>
    <Icon name="tuto" size="16px" />
    <Text as="span" ml="xxs-3" color="white" fontWeight="bold" className="tuto-tag__text">
      {label ?? 'Tuto'}
    </Text>
  </Flex>
);
