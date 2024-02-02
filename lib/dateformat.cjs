"use strict";

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const suffix = ['th', 'st', 'nd', 'rd'];

const formats = {
  // Day
  d: (d) => d.getDate().toString().padStart(2, '0'),
  D: (d) => days[d.getDay()].substring(0, 3),
  j: (d) => d.getDate().toString(),
  l: (d) => days[d.getDay()],
  N: (d) => (d.getDay() || 7).toString(),
  S: (d) => Math.floor(d.getDate() / 10) !== 1 ? suffix[d.getDate() % 10] ?? 'th' : 'th',
  w: (d) => d.getDay().toString(),
  z: (d) => Math.floor((d - new Date(d.getFullYear(), 0, 1)) / (1000 * 60 * 60 * 24)).toString(),
  // Week
  W: (d) => ((d) => {
      const W = getWeekNumber(d);
      const lastWeekNumber = getWeekNumber(new Date(d.getFullYear() - 1, 11, 31));
      const endOfYear = new Date(d.getFullYear(), 11, 31);
      const endOfYearWeekNumber = getWeekNumber(endOfYear);
      if (W === 0) {
        return lastWeekNumber;
      }
      if (W === endOfYearWeekNumber) {
        return module.exports.formats.N(endOfYear) < 4 ? 1 : endOfYearWeekNumber;
      }
      return W;
    })(d).toString().padStart(2, '0'),
  // Month
  F: (d) => months[d.getMonth()],
  m: (d) => (d.getMonth() + 1).toString().padStart(2, '0'),
  M: (d) => months[d.getMonth()].substring(0, 3),
  n: (d) => (d.getMonth() + 1).toString(),
  t: (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate().toString(),
  // Year
  L: (d) => new Date(d.getFullYear(), 1, 29).getMonth() === 1 ? '1' : '0',
  o: (d) => ((d) => {
      const W = Number(module.exports.formats.W(d));
      const n = Number(module.exports.formats.n(d));
      if (W === 1 && n === 12) {
        return d.getFullYear() + 1;
      }
      if (W >= 52 && n === 1) {
        return d.getFullYear() - 1;
      }
      return d.getFullYear();
    })(d).toString(),
  X: (d) => (d.getFullYear() < 0 ? '-' : '+') + Math.abs(d.getFullYear()).toString().padStart(4, '0'),
  x: (d) => (d.getFullYear() < 0 ? '-'
      : d.getFullYear() >= 10000 ? '+' : '') + Math.abs(d.getFullYear()).toString().padStart(4, '0'),
  Y: (d) => (d.getFullYear() < 0 ? '-' : '') + Math.abs(d.getFullYear()).toString().padStart(4, '0'),
  y: (d) => (d.getFullYear() < 0 ? '-' : '') + Math.abs(d.getFullYear()).toString().slice(-2),
  // Time
  a: (d) => (d.getHours() < 12) ? 'am' : 'pm',
  A: (d) => (d.getHours() < 12) ? 'AM' : 'PM',
  B: (d) => {
    const bielTimeDate = new Date();
    bielTimeDate.setTime(d.getTime() + d.getTimezoneOffset() * 60 * 1000 + 1 * 60 * 60 * 1000);
    return Math.floor((bielTimeDate.getHours() * 60 * 60 + bielTimeDate.getMinutes() * 60 + bielTimeDate.getSeconds()) / (60 * 60 * 24) * 1000).toString().padStart(3, '0');
  },
  g: (d) => ((d.getHours() % 12) || 12).toString(),
  G: (d) => d.getHours().toString(),
  h: (d) => ((d.getHours() % 12) || 12).toString().padStart(2, '0'),
  H: (d) => d.getHours().toString().padStart(2, '0'),
  i: (d) => d.getMinutes().toString().padStart(2, '0'),
  s: (d) => d.getSeconds().toString().padStart(2, '0'),
  u: (d) => (d.getMilliseconds() * 1000).toString().padStart(6, '0'),
  v: (d) => d.getMilliseconds().toString().padStart(3, '0'),
  // Timezone
  // incomplete
  e: (d) => Intl.DateTimeFormat?.()?.resolvedOptions?.()?.timeZone || (d.getTimezoneOffset() ? module.exports.formats.P(d) : 'UTC'),
  I: (d) => (d.getTimezoneOffset() < Math.max(
        new Date(d.getFullYear(), 0, 1).getTimezoneOffset(),
        new Date(d.getFullYear(), 6, 1).getTimezoneOffset()
      )) ? '1' : '0',
  O: (d) => (d.getTimezoneOffset() > 0 ? '-' : '+')
      + Math.abs(Math.floor(d.getTimezoneOffset() / 60) * 100 + d.getTimezoneOffset() % 60).toString().padStart(4, '0'),
  P: (d) => module.exports.formats.O(d).match(/[-+]?[0-9]{2}/g).join(':'),
  p: (d) => d.getTimezoneOffset() === 0 ? 'Z' : module.exports.formats.P(d),
  // incomplete
  T: (d) => d.getTimezoneOffset() === 0 ? 'UTC' : 'GMT' + module.exports.formats.O(d),
  Z: (d) => (d.getTimezoneOffset() * 60 * -1).toString(),
  // Full Date/Time
  c: (d) => module.exports.asString('Y-m-d\\TH:i:sP'),
  r: (d) => module.exports.asString('D, d M Y H:i:s O'),
  U: (d) => Math.floor(d.getTime() / 1000).toString(),
};

function asString(
  format = module.exports.ISO8601_FORMAT,
  date = module.exports.now()
) {
  if (typeof format !== 'string') {
    const originalArg2 = date;
    date = format;
    format = originalArg2;
  }
  if (!date) {
    date = module.exports.now();
  }
  if (!format) {
    format = module.exports.ISO8601_FORMAT;
  }

  try {
    createDate(date);
  } catch (e) {
    return '';
  }

  const dateObject = createDate(date);

  const formatChars = format.split('');
  let escape = false;

  return formatChars
    .map((char) => {
      if (escape) {
        escape = false;
        return char;
      }
      if (char === '\\') {
        escape = true;
        return '';
      }
      if (module.exports.formats[char] !== undefined) {
        return module.exports.formats[char](dateObject);
      }
      return char;
    })
    .join('');
}

function createDate(date) {
  const dateObject = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(dateObject.getTime())) {
    throw new Error('Invalid Date');
  }
  return dateObject;
}

function getWeekNumber(d) {
  const thursday = new Date(d.getTime());
  thursday.setDate(thursday.getDate() + 3 - (thursday.getDay() + 6) % 7);
  // January 4 is always in week 1
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.floor(
    ((thursday.getTime() - week1.getTime()) / (1000 * 60 * 60 * 24)
      - 3 + (week1.getDay() + 6) % 7) / 7
  );
}

/**
 * Used for testing - replace this function with a fixed date.
 */
function now() {
  return new Date();
}

module.exports = asString;
module.exports.asString = asString;
module.exports.formats = formats;
module.exports.now = now;
module.exports.ISO8601_FORMAT = "Y-m-d\\TH:i:s.vP";
module.exports.ISO8601_FORMAT_BASIC = "Ymd\\THisO";
module.exports.DATETIME_FORMAT = "d m Y H:i:s.v";
module.exports.ABSOLUTETIME_FORMAT = "H:i:s.v";
