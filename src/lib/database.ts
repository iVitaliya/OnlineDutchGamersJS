import { MonoxityDB } from "monoxity.db";

export const Database = {
  economy: new MonoxityDB({ fileName: "data", table: "economy" }),
  punishments: new MonoxityDB({ fileName: "data", table: "punishments" }),
  profiles: new MonoxityDB({ fileName: "data", table: "profiles" }),
  leveling: new MonoxityDB({ fileName: "data", table: "leveling" }),
  game: new MonoxityDB({ fileName: "data", table: "game" }),
  tickets: new MonoxityDB({ fileName: "data", table: "tickets" }),
  logging: new MonoxityDB({ fileName: "data", table: "logging" }),
  verify: new MonoxityDB({ fileName: "data", table: "verify" }),
};
