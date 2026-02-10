// ** Site-wide Public Paths ** //
export const SITE_PATHS = {
  HOME: '/',
  ABOUT: '/about-us',
  TERMS: '/terms-of-service',
  PRIVACY: '/privacy-policy',
} as const;

// ** Authentication Page Paths ** //
export const AUTH_PATHS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  VERIFY_EMAIL_INFO_PAGE: '/auth/verify-email',
  AUTH_ERROR: '/auth/error', // Placeholder
  UNAUTHORIZED: '/auth/unauthorized', // Placeholder
} as const;

// ** Protected Area Paths (require login) ** //
export const PROTECTED_PATHS = {
  SETTINGS_BASE: '/settings',
  DOCUMENTATION_BASE: '/documentation',
  DASHBOARD_BASE: '/dashboard',
} as const;

// ** API Authentication Paths ** //
export const API_AUTH_PATHS = {
  REGISTER: '/api/auth/register',
  VERIFY_EMAIL: '/api/auth/verify-email',
  RESEND_VERIFICATION_EMAIL: '/api/auth/resend-verification',
  FORGOT_PASSWORD: '/api/auth/forgot-password',
  RESET_PASSWORD: '/api/auth/reset-password',
} as const;

// ** Default Redirects ** //
export const DEFAULT_LOGIN_REDIRECT_PATH: string =
  PROTECTED_PATHS.SETTINGS_BASE;
export const DEFAULT_LOGOUT_REDIRECT_PATH: string = SITE_PATHS.HOME;

// ** Public Route Patterns ** //
export const PUBLIC_ROUTE_PATTERNS: string[] = [
  SITE_PATHS.HOME,
  SITE_PATHS.ABOUT,
  SITE_PATHS.TERMS,
  SITE_PATHS.PRIVACY,
  AUTH_PATHS.LOGIN,
  AUTH_PATHS.REGISTER,
  AUTH_PATHS.FORGOT_PASSWORD,
  AUTH_PATHS.RESET_PASSWORD,
  AUTH_PATHS.VERIFY_EMAIL_INFO_PAGE,
  AUTH_PATHS.AUTH_ERROR,
];

// ** API Route Prefixes ** //
export const API_ROUTE_PREFIX = '/api';
export const API_AUTH_ROUTE_PREFIX = '/api/auth';

// ** Special Route Identifiers (if needed by middleware or logic) ** //
export const ROOT_PATH = '/';

export const ISOLATED_LAYOUT_PATHS = [
  ...Object.values(AUTH_PATHS),

  '/signup/:path*',
];
