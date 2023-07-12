export enum UserRole {
  CUSTOMER = "CUSTOMER",
  DISPATCHER = "DISPATCHER",
  DELIVERER = "DELIVERER",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface UserUpdate {
  id: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UserInput {
  email: string;
  password: string;
  role: UserRole;
}
