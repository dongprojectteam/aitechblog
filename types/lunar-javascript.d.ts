declare module 'lunar-javascript' {
  export class Solar {
    static fromDate(date: Date): Solar;
    static fromYmd(year: number, month: number, day: number): Solar;
    static fromJulianDay(julianDay: number): Solar;
    
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getJulianDay(): number;
    getWeek(): number;
    getWeekInMonth(): number;
    getWeekOfYear(): number;
    getConstellation(): string;
    
    getLunar(): Lunar;
    
    toFullString(): string;
    toString(): string;
  }

  export class Lunar {
    static fromDate(date: Date): Lunar;
    static fromYmd(year: number, month: number, day: number): Lunar;
    static fromSolar(solar: Solar): Lunar;

    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getJulianDay(): number;
    getYearInGanZhi(): string;
    getMonthInGanZhi(): string;
    getDayInGanZhi(): string;
    getYearInChinese(): string;
    getMonthInChinese(): string;
    getDayInChinese(): string;
    getYearShengXiao(): string;
    
    getSolar(): Solar;
    
    toFullString(): string;
    toString(): string;
  }

  export class HolidayUtil {
    static getHoliday(year: number, month: number, day: number): string | null;
    static getHolidays(year: number): Array<{day: string, name: string}>;
    static getWeekend(year: number, month: number, day: number): string | null;
  }

  export class SolarUtil {
    static isLeapYear(year: number): boolean;
    static getDaysOfMonth(year: number, month: number): number;
    static getWeeksOfMonth(year: number, month: number, start: number): number;
  }

  export class LunarUtil {
    static getJieQi(year: number, month: number, day: number): string | null;
    static getJie(year: number, month: number, day: number): string | null;
    static getQi(year: number, month: number, day: number): string | null;
  }
}