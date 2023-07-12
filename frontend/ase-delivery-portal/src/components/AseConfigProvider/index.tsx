import React, { FC, useEffect, useMemo, useState } from "react";
import { IntlProvider } from "react-intl";
import German from "../../locales/de-DE";
import English from "../../locales/en-US";

interface AseConfigProviderProps {
  locale: Locale;
  changeLocale: (locale: Locale) => void;
}

enum Locale {
  DeDE = "de-DE",
  EnUS = "en-US",
}

const AseConfig = React.createContext<AseConfigProviderProps>({
  locale: Locale.EnUS,
  changeLocale: () => {},
});

interface AseConfigProps {
  children?: React.ReactNode | React.ReactNode[];
}

const localeKey = "locale";

export const AseConfigProvider: FC<AseConfigProps> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>(
    localStorage.getItem(localeKey) as Locale
  );

  useEffect(() => {
    if (!localStorage.getItem(localeKey)) {
      localStorage.setItem(localeKey, Locale.EnUS);
    }
  }, []);

  const messages = useMemo(() => {
    switch (locale) {
      case Locale.DeDE:
        return German;
      case Locale.EnUS:
        return English;
      default:
        return English;
    }
  }, [locale]);

  const changeLocale = (locale: Locale) => {
    setLocale(locale);
    localStorage.setItem(localeKey, locale);
  };

  return (
    <AseConfig.Provider value={{ locale, changeLocale }}>
      <IntlProvider locale={locale} messages={messages} onError={() => null}>
        {children}
      </IntlProvider>
    </AseConfig.Provider>
  );
};
