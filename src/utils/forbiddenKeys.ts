import { red } from "colorette";

import { logger } from "../lib/index";
const Logger = logger({ name: "Forbidden-Keys" });

let invalidCharacters: string[] = [
    "?",
    "!",
    "\\",
    "/",
    "|",
    '"',
    "'",
    ":",
    ";",
    "[",
    "]",
    "{",
    "}",
    "=",
    "\u200b",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
  ],
  bannedKeys: string[] = [
    "pussy",
    "p*ssy",
    "p_ssy",
    "p**sy",
    "p__sy",
    "dick",
    "d*ck",
    "d_ck",
    "cock",
    "cuck",
    "c*ck",
    "c_ck",
    "c**k",
    "c__k",
    "penis",
    "p*nis",
    "p_nis",
    "p**is",
    "p__is",
    "fuck",
    "whore",
    "hoe",
    "cunt",
    "f*ck",
    "f**k",
    "f***",
  ],
  badSeperators: string[] = [
    "\u200b",
    "!",
    "?",
    "+",
    "=",
    "@",
    "#",
    "$",
    "%",
    "^",
    "&",
    "*",
    "(",
    ")",
    "_",
    "`",
    '"',
    "'",
    ";",
  ],
  badDeviders: string[] = [
    "\u200b",
    "!",
    "?",
    "+",
    ")",
    "(",
    "^",
    "%",
    "$",
    "`",
    '"',
    "'",
    ";",
  ];

export const CheckFor = {
  BadKey: (key: string): boolean => {
    for (let i = 0; i < invalidCharacters.length; i++) {
      let str = key.includes(invalidCharacters[i]!);
      if (str) {
        Logger.error(
          `You defined "${
            red(invalidCharacters[i]!)
          }" in your key which isn"t an allowed character, please refrain from using the following characters in your key: "${
            invalidCharacters.join('", "')
          }"`,
        );

        return true;
      }
    }

    for (let i = 0; i < bannedKeys.length; i++) {
      let str = key.includes(bannedKeys[i]!);
      if (str) {
        Logger.error(
          `You defined "${
            red(bannedKeys[i]!)
          }" in your key which is a banned word, please refrain from using the following words in your key: "${
            bannedKeys.join('", "')
          }"`,
        );
      }

      return true;
    }

    return false;
  },

  InvalidSeperator: (key: string): boolean => {
    for (let i = 0; i < badSeperators.length; i++) {
      let str = key.includes(badSeperators[i]!);
      if (str) {
        Logger.error(
          `The character "${
            red(badSeperators[i]!)
          }" isn"t allowed to be used as a seperator, please use one of the following characters instead as seperator: "-", ".", ",", "|"`,
        );

        return true;
      }
    }

    return false;
  },

  BadDevider: (key: string, checkIfIncludes: boolean): boolean => {
    for (let i = 0; i < badDeviders.length; i++) {
      let str = checkIfIncludes
        ? key.includes(badDeviders[i]!)
        : key === badDeviders[i];
      if (str) {
        Logger.error(
          `The character ${
            red(badDeviders[i]!)
          } isn"t allowed to be used as a devider, please use one of the following characters instead as devider: "-", ",", "|", ":", "@", "#", "~"`,
        );
      }

      return true;
    }

    return false;
  },
};
