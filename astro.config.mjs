import { defineConfig } from 'astro/config';

// SITE_URL e BASE_PATH arrivano dal workflow di deploy (vedi DEPLOY.md).
// In locale restano i valori di default.
export default defineConfig({
  site: process.env.SITE_URL || 'http://localhost:4321',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
});
