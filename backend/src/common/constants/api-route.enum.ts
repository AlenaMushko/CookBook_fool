import { ApiVersion } from './api-version.enum';

export enum ApiRoute {
  AUTH = 'auth',
  DISH = 'dish',
  MENU = 'menu',
  USER = 'user',
  INGREDIENTS = 'ingredients',
  MEASUREMENT_UNITS = 'measurement-units',
  S3 = 's3',
  CONVERSIONS = 'conversions',
  HEALTH = 'health',
}

export const apiPath = (route: ApiRoute): string => `${ApiVersion.V1}/${route}`;
