export const getEnv = function <T = string>(key: string): T {
  return import.meta.env[key] ?? undefined;
};
