// /drizzle.config.ts
import { Config } from "drizzle-kit";

// Type safety config: Config 의 규격을 엄격히 검증합니다.
export default {
  dialect: "sqlite",
  driver: "expo", // <-- very important
  schema: "./src/db/drizzle/schema.ts",
  out: "./src/db/drizzle/migrations",

  verbose: true,
  strict: true,
} satisfies Config;
