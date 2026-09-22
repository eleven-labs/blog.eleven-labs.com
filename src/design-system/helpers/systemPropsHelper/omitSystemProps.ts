export const omitSystemProps = <TProps extends Record<string, unknown>>(options: {
  props: TProps;
  systemPropNames: string[];
}): Record<string, unknown> =>
  typeof options.props === 'object'
    ? Object.keys(options.props).reduce<Record<string, unknown>>(
        (currentProps, propName) => {
          if (!options.systemPropNames.includes(propName)) {
            currentProps[propName] = options.props[propName as keyof typeof options.props];
          }

          return currentProps;
        },
        {} as Record<string, unknown>
      )
    : {};
