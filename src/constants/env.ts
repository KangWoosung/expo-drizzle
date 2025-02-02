import { EnvSchemaType } from "@/zod-schemas/env";

const defaultAppName = "Hoerzu";
const defaultAppPropaganda = "The best music database on your hands";
const defaultAvatarObjUri =
  "https://lh3.googleusercontent.com/a/ACg8ocKccqoaXRjGfgAzJ4APdpMvN-68F35oZICy8vJNoGm0mjbOgcp5=s360-c-no";

const defaultDbName = "HOERZU";
const defaultToastTimeout = 2000;

export const ENV: EnvSchemaType = {
  APP_NAME: defaultAppName,
  APP_PROPAGANDA: defaultAppPropaganda,
  DB_NAME: defaultDbName,
  TOAST_TIMEOUT: defaultToastTimeout,
  AVATAR_OBJ: {
    uri: defaultAvatarObjUri,
  },
};
