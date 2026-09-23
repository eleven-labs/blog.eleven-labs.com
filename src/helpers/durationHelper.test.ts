import { formatDuration, toIsoDuration } from './durationHelper';

describe('formatDuration', () => {
  const units = { hour: 'h', minute: 'min' };

  it('should display the minutes alone under an hour', () => {
    expect(formatDuration(1, units)).toBe('1 min');
    expect(formatDuration(45, units)).toBe('45 min');
    expect(formatDuration(59, units)).toBe('59 min');
  });

  it('should display the hours alone on an exact hour', () => {
    expect(formatDuration(60, units)).toBe('1 h');
    expect(formatDuration(120, units)).toBe('2 h');
  });

  it('should display the hours and the minutes padded to two digits from an hour', () => {
    expect(formatDuration(61, units)).toBe('1 h 01 min');
    expect(formatDuration(122, units)).toBe('2 h 02 min');
    expect(formatDuration(135, units)).toBe('2 h 15 min');
  });

  it('should use the given units', () => {
    expect(formatDuration(122, { hour: 'hr', minute: 'mins' })).toBe('2 hr 02 mins');
  });
});

describe('toIsoDuration', () => {
  it('should convert the minutes into an ISO 8601 duration', () => {
    expect(toIsoDuration(0)).toBe('PT0M');
    expect(toIsoDuration(45)).toBe('PT45M');
    expect(toIsoDuration(60)).toBe('PT1H');
    expect(toIsoDuration(122)).toBe('PT2H2M');
  });
});
