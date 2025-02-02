/*
2025-01-29 18:31:30


export const appName = "Hoerzu";
export const appPropaganda = "The best music database on your hands";
export const DB_NAME = "HOERZU";
export const TOAST_TIMEOUT = 2000;
export const avatarObj = {
  uri: "https://lh3.googleusercontent.com/a/ACg8ocKccqoaXRjGfgAzJ4APdpMvN-68F35oZICy8vJNoGm0mjbOgcp5=s360-c-no",
};

*/

import { z } from "zod";

export const EnvSchema = z.object({
  APP_NAME: z.string(),
  APP_PROPAGANDA: z.string(),
  DB_NAME: z.string(),
  TOAST_TIMEOUT: z.number(),
  AVATAR_OBJ: z.object({
    uri: z.string(),
  }),
});

export type EnvSchemaType = z.infer<typeof EnvSchema>;
