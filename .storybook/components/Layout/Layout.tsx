import { Canvas } from '@storybook/addon-docs';
import React from 'react';

import { Heading, Text } from '@/design-system';

export interface LayoutProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ title, description, children }) => (
  <>
    <style
      dangerouslySetInnerHTML={{
        __html:
          '.sbdocs-wrapper {padding: 0;} .docs-story > div {margin: 0; padding: 0;} .sbdocs-content {max-width: inherit;} .sbdocs-preview {margin: 0; border: none;border-radius: 0;box-shadow: none;} .docs-story > div:nth-child(2) {display: none;} .docs-story .innerZoomElementWrapper > div {max-width: inherit; border-width:0px !important;}',
      }}
    />
    <Canvas>
      <main>
        {title && (
          <div className="bg-primary px-l py-xxl text-white">
            <Heading size="xl">
              {title}
            </Heading>
            {description && <Text size="m" className="mt-xxs" dangerouslySetInnerHTML={{ __html: description }} />}
          </div>
        )}
        <div className="mt-s px-l">{children}</div>
      </main>
    </Canvas>
  </>
);
