import {UserRole} from "../repository/types/user";
import {LoginCredentials} from "../repository/types/auth";

export enum AseRoute {
  HOME = "/",
  LOGIN = "/login",
  FOUROHFOUR = "/404",
  FORBIDDEN = "/forbidden",
  BOXES = "/boxes",
  BOX = "/boxes/box/:id",
  DELIVERIES = "/deliveries",
  DELIVERY = "/deliveries/delivery/:id",
  DELIVERY_CONFIGURATION = "/deliveries/new-delivery",
  EDIT_DELIVERY = "/deliveries/new-delivery/:id",
  USERS = "/users",
  USER_DETAILS = "/user-details",
  SCAN_QR = "/api/scan-qr/:id",
  PRIVACY = "/privacy",
  IMPRINT = "/imprint",
  STATISTICS = "/statistics",
}

// routes that require authorization or authentication
export const protectedRoutes: AseRoute[] = [
  AseRoute.USERS,
  AseRoute.DELIVERIES,
  AseRoute.DELIVERY_CONFIGURATION,
  AseRoute.EDIT_DELIVERY,
  AseRoute.BOXES,
  AseRoute.USER_DETAILS,
  AseRoute.STATISTICS,
];

// Mapping of user roles to allowed routes
const authorizationMap = new Map<UserRole, AseRoute[]>([
  [UserRole.CUSTOMER, [AseRoute.USER_DETAILS, AseRoute.DELIVERIES]],
  [
    UserRole.DISPATCHER,
    [
      AseRoute.USER_DETAILS,
      AseRoute.DELIVERIES,
      AseRoute.USERS,
      AseRoute.BOXES,
      AseRoute.STATISTICS,
    ],
  ],
  [UserRole.DELIVERER, [AseRoute.USER_DETAILS, AseRoute.DELIVERIES]],
]);

export const isAuthorizedForRoute = (
  role: UserRole | undefined,
  route: string
): boolean => {
  // check if route requires login
  if (!protectedRoutes.find(protectedRoute => route.startsWith(protectedRoute))) {
    return true;
  }

  if (!role) {
    return false;
  }

  const allowedRoutesForRole = authorizationMap.get(role) || [];

  return !!allowedRoutesForRole.find(allowedRoute => route.startsWith(allowedRoute));
};

export const credentialsToBaseAuthHeader = (
  credentials: LoginCredentials
): string => {
  return btoa(
    unescape(encodeURIComponent(credentials.email + ":" + credentials.password))
  );
};
