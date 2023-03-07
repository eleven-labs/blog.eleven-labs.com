import React from 'react';

export const Script: React.FC<React.ComponentProps<'script'>> = (props) => {
  const ref = React.useRef<HTMLScriptElement>(null);
  React.useEffect(() => {
    if (ref?.current) {
      const script = Object.assign(document.createElement('script'), props);
      ref.current.replaceWith(script);
    }
  }, [ref?.current, props]);

  return <script ref={ref} {...props} />;
};
