export const APP_ROUTES = {
    AUTH: {
      LOGIN: 'login',
    },
    DASHBOARD: {
      ROOT: 'app',
      MAIN: 'dashboard',
      FULL_PATH: 'app/dashboard'
    }
  } as const;

  export const ROUTE_PATHS = {
    LOGIN: `/${APP_ROUTES.AUTH.LOGIN}`,
    DASHBOARD: `/${APP_ROUTES.DASHBOARD.FULL_PATH}`,
  } as const;