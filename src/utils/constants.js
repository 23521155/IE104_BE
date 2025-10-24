import { env } from '~/config/environment';
//whitelist domain nhung domain dc truy cap
export const WHITELIST_DOMAINS = [
    'http://localhost:63342',
    'https://mern-murex-nu.vercel.app',
    // them domain];
];

export const WEBSITE_DOMAIN =
    env.BUILD_MODE === 'production' ? env.WEBSITE_DOMAIN_PRODUCTION : env.WEBSITE_DOMAIN_DEVELOPMENT;

export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 24;
