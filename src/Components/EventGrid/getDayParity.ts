const HOURS_PER_DAY = 24;
const MINUTES_PER_HOUR = 60;
const SECONDS_PER_MINUTE = 60;
const MS_PER_SECOND = 1000;
const MS_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR * SECONDS_PER_MINUTE * MS_PER_SECOND;

export const getDayParity = (day: string) => {
  const dayIndex = Math.floor(Date.parse(`${day}T00:00:00Z`) / MS_PER_DAY);
  return dayIndex % 2 === 0 ? "even" : "odd";
};

export type DayParity = ReturnType<typeof getDayParity>;
