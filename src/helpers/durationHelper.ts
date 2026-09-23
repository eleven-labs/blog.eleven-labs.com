const MINUTES_PER_HOUR = 60;

const splitMinutes = (minutes: number): { hours: number; minutes: number } => ({
  hours: Math.floor(minutes / MINUTES_PER_HOUR),
  minutes: minutes % MINUTES_PER_HOUR,
});

/**
 * Format a duration in minutes into a readable string.
 * @param minutes - The duration in minutes.
 * @param units - The translated abbreviations of an hour and a minute.
 * @returns The minutes alone under an hour (`45 min`), else hours and minutes (`2 h 02 min`, `1 h`).
 */
export const formatDuration = (minutes: number, units: { hour: string; minute: string }): string => {
  const duration = splitMinutes(minutes);

  if (duration.hours === 0) {
    return `${duration.minutes} ${units.minute}`;
  }

  const hours = `${duration.hours} ${units.hour}`;
  return duration.minutes === 0
    ? hours
    : `${hours} ${String(duration.minutes).padStart(2, '0')} ${units.minute}`;
};

/**
 * Convert a duration in minutes into an ISO 8601 duration.
 * @param minutes - The duration in minutes.
 * @returns The ISO 8601 duration, e.g. `PT45M`, `PT1H` or `PT2H2M`.
 */
export const toIsoDuration = (minutes: number): string => {
  const duration = splitMinutes(minutes);
  const hours = duration.hours > 0 ? `${duration.hours}H` : '';
  const remainingMinutes = duration.minutes > 0 || duration.hours === 0 ? `${duration.minutes}M` : '';

  return `PT${hours}${remainingMinutes}`;
};
