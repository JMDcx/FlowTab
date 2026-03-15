import greeting from "./greeting";
import ipInfo from "./ipInfo";
import links from "./links";
import message from "./message";
import notes from "./notes";
import search from "./search";
import time from "./time";
import weather from "./weather";
import workHours from "./workHours";

export const widgetConfigs = [
  greeting,
  ipInfo,
  links,
  message,
  notes,
  search,
  time,
  weather,
  workHours,
];

widgetConfigs.sort((a, b) => a.name.localeCompare(b.name));
