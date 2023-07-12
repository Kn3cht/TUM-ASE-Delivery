import { Address, Country } from "../repository/types/box";
import React from "react";
import styles from "./formatters.module.scss";

export const countryFlagMap = new Map<Country, string>([
  [Country.GERMANY, "🇩🇪"],
]);

export const countryLocalizationMap = new Map<Country, string>([
  [Country.GERMANY, "Germany"],
]);

export const buildFullAddress = (address: Address): string => {
  const { street, houseNumber, city, zipCode, addition, country } = address;
  const ret: string[] = [];
  ret.push(street);
  if (addition) {
    ret.push(`${houseNumber}${addition}`);
  } else {
    ret.push(`${houseNumber}`);
  }
  ret.push(",");
  ret.push(`${zipCode}`);
  ret.push(city);
  ret.push(`| (${countryFlagMap.get(Country[country])})`);
  return ret.join(" ");
};

export const highlightText = (
  text: string,
  searchQuery: string | undefined
): React.ReactNode => {
  if (!searchQuery) {
    return <span>{text}</span>;
  }

  const searchQueryLowerCase = searchQuery.toLowerCase();

  const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => {
        const match = part.toLowerCase() === searchQueryLowerCase;
        return (
          <span key={i} className={match ? styles.highlight : undefined}>
            {part}
          </span>
        );
      })}
    </span>
  );
};
