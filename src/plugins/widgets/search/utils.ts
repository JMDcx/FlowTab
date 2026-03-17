import tlds from "tlds";
import { engines } from "./engines";

export function isDirectNavigationInput(query: string) {
  return (
    /^https?:\/\/\w+/.test(query) ||
    (tlds.some((tld) => query.endsWith(`.${tld}`)) && !query.includes(" "))
  );
}

export function normalizeDirectNavigationInput(query: string) {
  return /^https?:\/\//.test(query) ? query : `https://${query}`;
}

// TODO: Add unit tests
export function buildUrl(query: string, engineUrl: string) {
  // See if they have started with a web scheme
  if (isDirectNavigationInput(query)) {
    return normalizeDirectNavigationInput(query);
  }

  // Probably searching then
  return engineUrl.replace("{searchTerms}", encodeURIComponent(query));
}

export function getSearchUrl(key: string) {
  const engine = engines.find((engine) => engine.key === key);

  return (engine || engines[0]).search_url;
}

export function getSuggestUrl(key?: string) {
  const engine = engines.find((engine) => engine.key === key);

  return engine ? engine.suggest_url : undefined;
}
