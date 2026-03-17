import React, { FC, useMemo, useRef, useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import { getSuggestions } from "./getSuggestions";
import Suggestions from "./Suggestions";
import { Props, defaultData } from "./types";
import {
  buildUrl,
  getSearchUrl,
  getSuggestUrl,
  isDirectNavigationInput,
  normalizeDirectNavigationInput,
} from "./utils";
import "./Search.sass";

const messages = defineMessages({
  placeholder: {
    id: "plugins.search.placeholder",
    description: "Placeholder text to show in the search box before typing",
    defaultMessage: "Type to search",
  },
});

const Search: FC<Props> = ({ data = defaultData }) => {
  const searchInput = useRef<HTMLInputElement>(null);
  const previousValue = useRef("");
  const chromeSearch = (
    globalThis as typeof globalThis & {
      chrome?: {
        search?: {
          query?: (input: { disposition: string; text: string }) => void;
        };
      };
    }
  ).chrome?.search;

  const [active, setActive] = useState<number>();
  const [suggestions, setSuggestions] = useState<string[]>();

  const intl = useIntl();
  const placeholder = useMemo(
    () => intl.formatMessage(messages.placeholder),
    [intl],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    previousValue.current = event.target.value;

    if (BUILD_TARGET === "web") {
      const suggestUrl = getSuggestUrl(data.suggestionsEngine);
      if (suggestUrl) {
        getSuggestions(event.target.value, suggestUrl).then((suggestions) => {
          setSuggestions(suggestions.slice(0, data.suggestionsQuantity));
          setActive(undefined);
        });
      }
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions) {
      return;
    }

    event.preventDefault();

    switch (event.key) {
      case "ArrowUp":
        const upTo = !active ? suggestions.length - 1 : active - 1;
        searchInput.current!.value = suggestions[upTo];
        setActive(upTo);
        break;

      case "ArrowDown":
        const downTo =
          active === undefined || active === suggestions.length - 1
            ? 0
            : active + 1;
        searchInput.current!.value = suggestions[downTo];
        setActive(downTo);
        break;

      case "Escape":
        if (active) {
          setActive(undefined);
          searchInput.current!.value = previousValue.current;
        } else if (suggestions) {
          setSuggestions(undefined);
        }
        break;
    }
  };

  const handleSelect = (suggestion: string) => {
    searchInput.current!.value = suggestion;
    search();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    search();
  };

  const search = () => {
    const query = searchInput.current!.value.trim();
    if (!query) return;

    if (BUILD_TARGET === "chromium" && BUILD_FLAVOR === "chrome") {
      if (isDirectNavigationInput(query)) {
        document.location.assign(normalizeDirectNavigationInput(query));
        return;
      }

      if (chromeSearch?.query) {
        chromeSearch.query({
          disposition: "CURRENT_TAB",
          text: query,
        });
        return;
      }
    }

    document.location.assign(buildUrl(query, getSearchUrl(data.searchEngine)));
  };

  return (
    <form className="Search" onSubmit={handleSubmit}>
      <input
        autoFocus
        defaultValue=""
        placeholder={placeholder}
        ref={searchInput}
        tabIndex={1}
        type="text"
        onChange={handleChange}
        onKeyUp={handleKeyUp}
      />

      {suggestions && (
        <Suggestions
          active={active}
          setActive={setActive}
          suggestions={suggestions}
          onSelect={handleSelect}
        />
      )}
    </form>
  );
};

export default Search;
