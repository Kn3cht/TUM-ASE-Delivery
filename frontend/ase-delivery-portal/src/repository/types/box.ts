export enum Country {
  GERMANY = "GERMANY",
}

export interface Address {
  street: string;
  city: string;
  addition?: string;
  houseNumber: number;
  zipCode: number;
  country: Country;
}

export interface AddressInput {
  street?: string;
  city?: string;
  addition?: string;
  houseNumber?: number;
  zipCode?: number;
  country?: Country;
}

export interface Box {
  id: string;
  name: string;
  raspberryPiId: string;
  address: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface BoxUpdate {
  id: string;
  name: string;
  raspberryPiId: string;
  address: AddressInput;
}

export interface BoxInput {
  name: string;
  raspberryPiId: string;
  address: AddressInput;
}
