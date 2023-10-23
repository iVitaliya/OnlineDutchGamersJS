import { logger } from "../lib/index";

const log = logger({ name: "ENVIRONMENT" });

export const Environment = {
  get: (key: string, default_value?: string) => {
    const envValue = process.env[key];

    if (typeof envValue !== "string") {
      log.error(
        "The provided key doesn't exist yet or it couldn't be fetched properly, check if the provided key exists, if it doesn exist, define it in the .env file as followed: KEY=VALUE (replacing key with the key and value with the value)",
      );

      return default_value ?? "";
    }

    return envValue;
  },
};
