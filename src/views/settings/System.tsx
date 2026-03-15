import React from "react";
import { FormattedMessage } from "react-intl";
import { db } from "../../db/state";
import { useKey } from "../../lib/db/react";
import TimeZoneInput from "../shared/timeZone/TimeZoneInput";

const System: React.FC = () => {
  const [locale, setLocale] = useKey(db, "locale");
  const [timeZone, setTimeZone] = useKey(db, "timeZone");

  return (
    <div>
      <h2>
        <FormattedMessage
          id="settings"
          defaultMessage="Settings"
          description="Settings title"
        />
      </h2>

      <label
        style={{
          alignItems: "center",
          display: "grid",
          gridGap: "0 0.5rem",
          gridTemplateColumns: "1fr 2fr",
          width: "100%",
          margin: 0,
        }}
      >
        <span>Language</span>
        <select
          value={locale}
          onChange={(event) => setLocale(event.target.value)}
        >
          <option value="en" title="English (American)">
            English
          </option>
          <option value="zh-CN" title="Simplified Chinese (China)">
            中文（中国）
          </option>
          <option value="zh-TW" title="Traditional Chinese (Taiwan)">
            中文（台灣）
          </option>
        </select>
      </label>

      <label
        style={{
          alignItems: "center",
          display: "grid",
          gridGap: "0 0.5rem",
          gridTemplateColumns: "1fr 2fr",
          width: "100%",
          margin: 0,
        }}
      >
        Time Zone
        <TimeZoneInput timeZone={timeZone} onChange={setTimeZone} />
      </label>
    </div>
  );
};

export default System;
