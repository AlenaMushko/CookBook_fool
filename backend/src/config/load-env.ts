import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'fs';
import { resolve } from 'path';

const ENV_FILES = [
  resolve(process.cwd(), '../.env'),
  resolve(process.cwd(), '.env'),
  resolve(process.cwd(), 'environments/local.env'),
];

for (const path of ENV_FILES) {
  if (existsSync(path)) {
    loadDotenv({ path, override: true });
  }
}
