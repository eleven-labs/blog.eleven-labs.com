export const getDefaultHeader = (): string => {
  const defaultHeader = [`Do not edit directly`, `Generated on ${new Date().toUTCString()}`];

  const lineSeparator = `\n`;
  const prefix = ` * `;
  const header = `/**${lineSeparator}`;
  const footer = `${lineSeparator} */${lineSeparator}${lineSeparator}`;

  return `${header}${defaultHeader.map((line) => `${prefix}${line}`).join(lineSeparator)}${footer}`;
};
