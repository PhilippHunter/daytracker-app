import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  out: './drizzle',
  schema: './database/Schema.ts',
  dialect: 'sqlite',
  driver: 'expo',
  dbCredentials: {
    url: process.env.DB_FILE_NAME!,
  },
} satisfies Config;
