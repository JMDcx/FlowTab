import React from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import { db } from "../db/state";
import { useValue } from "../lib/db/react";
import { messages } from "./locales";

const IntlProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const locale = useValue(db, "locale");
  const resolvedLocale = locale in messages ? locale : "en";

  return (
    <ReactIntlProvider
      locale={resolvedLocale}
      messages={messages[resolvedLocale]}
    >
      {children}
    </ReactIntlProvider>
  );
};

export default IntlProvider;
