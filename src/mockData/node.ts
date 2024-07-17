import { setupServer } from "msw/node";
import { categoriesHandler } from "./handlers/categoriesHandler.ts";
import { exerciseTypesForUserHandler } from "./handlers/exerciseTypesForUserHandler.ts";
import { routinesForUserHandler } from "./handlers/routinesForUserHandler.ts";
import { userSettingsHandler } from "./handlers/userSettingsHandler.ts";
import { workoutsForUserHandler } from "./handlers/workoutsForUserHandler.ts";

export const server = setupServer(
  ...categoriesHandler,
  ...exerciseTypesForUserHandler,
  ...routinesForUserHandler,
  ...userSettingsHandler,
  ...workoutsForUserHandler
);
