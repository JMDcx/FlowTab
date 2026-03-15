import { pick } from "in-browser-language";
import zhCN from "./lang/zh-CN.json";
import zhTW from "./lang/zh-TW.json";

export const messages: Record<string, Record<string, string>> = {
  en: {},
  zh: {},
  "zh-CN": zhCN,
  "zh-TW": zhTW,
};

export const locales = Object.keys(messages);
export const defaultLocale = pick(locales, "en");
