import moment from "moment";
import parsems from "parse-ms";

import type { ITime, KeyofType } from "../lib/index";

export const Sleep = (
  ms: number,
) => Promise.resolve(setTimeout(() => null, ms));

export function parseTime(ms: number, {
  fromNow = false,
  includeSeconds = false,
  base = "",
} = {}) {
  let obj = fromNow ? parsems(ms) : parsems(Date.now() - ms);

  for (let i in obj) {
    if (
      obj[i as KeyofType<typeof obj>] === 0 ||
      ["milliseconds", "microseconds", "nanoseconds"].includes(i) ||
      (!includeSeconds && i === "seconds")
    ) {
      continue;
    }
    base += `${obj[i as KeyofType<typeof obj>]} ${
      obj[i as KeyofType<typeof obj>] === 1 ? i.slice(0, -1) : i
    } `;
  }

  return !base ? "Just now" : base + "ago";
}

function getTimeLength(
  int: number,
): { int: number; changed: ITime["changed"] } {
  const str = String(int);
  let i = int;
  let r: ITime["changed"] = "none";

  if (str.length === 1) {
    if ([6, 7, 8, 9].includes(i)) {
      i = 10;
      r = "raised";
    }
    if ([1, 2, 3, 4].includes(i)) {
      i = 5;
      r = "lowered";
    }

    return { int: i, changed: r };
  }

  return { int: i, changed: "none" };
}

function getMaxTime(int: number) {
  const maxInt = 600;

  if (int > maxInt) return 600;
  else return int;
}

export async function countDown(start: number): Promise<ITime> {
  let s = getTimeLength(start);
  let ss = s.int;

  if (ss !== start) {
    await Sleep(5 * 1000);
    ss = ss - 5;
  }

  return {
    state: ss === start ? "Completed" : "In Progress",
    changed: s.changed,
    current_time: ss,
  };
}

export async function countUp(end: number): Promise<ITime> {
  let e = getTimeLength(end);
  let ee = e.int;
  let s = 0;
  let maxEnd = getMaxTime(ee);

  if (s !== maxEnd) {
    await Sleep(5 * 1000);
    s = s + 5;
  }

  return {
    state: s === maxEnd ? "Completed" : "In Progress",
    changed: e.changed,
    current_time: s,
  };
}

const FooterTime = moment(Date.now()).format(
  "[The] Do [of] MMMM YYYY [@] h:mm:ss A",
);
export const FooterText = `Requested at ${FooterTime}`;
