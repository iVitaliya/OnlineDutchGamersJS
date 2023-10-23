// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= "development";

import "@sapphire/plugin-api/register";
import "@sapphire/plugin-editable-commands/register";
import "@sapphire/plugin-logger/register";
import * as colorette from "colorette";
import { config } from "dotenv-cra";
import { join, resolve } from "path";
import "reflect-metadata";
import { inspect } from "util";
import { rootDir } from "./index";

// Read env var
config({ path: resolve(join(rootDir, ".env")) });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });
