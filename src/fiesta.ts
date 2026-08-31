export const FIRST_YEAR_TIMESTAMP = 1560275700000;
export const YEAR_DURATION = 446400000; // 5 SB days * 20min = 5d 4h
export const MONTH_DURATION = 37200000; // 31 SB days * 20 minutes
const DAY_DURATION = 20 * 60 * 1000; // 1 SB day = 20 real life minutes

const FIESTA_DURATION = 7 * DAY_DURATION; // Each Fiesta lasts 7 SB days (2h 20m)

export type FiestaSeason = {
  month: number;
  emoji: string;
  skipped: boolean;
};

// SkyBlock months where Mining Fiestas occur,
//      per https://hypixel.net/threads/hypixel-skyblock-0-24-2-hub-revamp-latest-minecraft-year-of-the-witch-and-more.6063723/
export const FIESTA_SEASONS: FiestaSeason[] = [
  { month: 2, emoji: ":cherry_blossom:", skipped: true }, // 1st of Spring, always skipped because Cole isn't elected yet
  { month: 4, emoji: ":sunny:", skipped: false }, // 1st of Early Summer
  { month: 6, emoji: ":sun_with_face:", skipped: false }, // 1st of Late Summer
  { month: 8, emoji: ":fallen_leaf:", skipped: false }, // 1st of Autumn
  { month: 10, emoji: ":snowflake:", skipped: false }, // 1st of Early Winter
];

export type Fiesta = FiestaSeason & {
  start: number;
  end: number;
};

export function getYearStart(year: number): number {
  return FIRST_YEAR_TIMESTAMP + (year - 1) * YEAR_DURATION;
}

export function getCurrentFiestaYear(now = Date.now()): number {
  return Math.floor((now - FIRST_YEAR_TIMESTAMP) / YEAR_DURATION) + 1;
}

export function getFiestas(year: number): Fiesta[] {
  const yearStart = getYearStart(year);

  return FIESTA_SEASONS.map((season) => {
    const monthStart = yearStart + (season.month - 1) * MONTH_DURATION;
    const start = monthStart;

    return {
      ...season,
      start,
      end: start + FIESTA_DURATION,
    };
  });
}
