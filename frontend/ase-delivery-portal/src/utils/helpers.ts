import { Address, Box } from "../repository/types/box";
import { buildFullAddress } from "./formatters";
import { Delivery } from "../repository/types/delivery";

export const addressContainsQueryString = (
  address: Address,
  searchQuery: string | undefined
): boolean => {
  if (!searchQuery) {
    return true;
  }
  const searchQueryLowerCase = searchQuery.toLowerCase();

  const addressString = buildFullAddress(address);

  return addressString.toLowerCase().includes(searchQueryLowerCase);
};

export const boxContainsQueryString = (
  box: Box,
  searchQuery: string | undefined
): boolean => {
  if (!searchQuery) {
    return true;
  }

  const searchQueryLowerCase = searchQuery.toLowerCase();

  return (
    box.name.toLowerCase().includes(searchQueryLowerCase) ||
    box.raspberryPiId.toLowerCase().includes(searchQueryLowerCase) ||
    addressContainsQueryString(box.address, searchQuery)
  );
};

export const deliveryContainsQueryString = (
  delivery: Delivery,
  searchQuery: string | undefined
): boolean => {
  if (!searchQuery) {
    return true;
  }

  const searchQueryLowerCase = searchQuery.toLowerCase();

  return (
    delivery.courierEmail.toLowerCase().includes(searchQueryLowerCase) ||
    delivery.customerEmail.toLowerCase().includes(searchQueryLowerCase)
  );
};
