import { API } from "../../types";

export type Link = {
  customIcon?: string;
  iconPositionX?: number;
  iconPositionY?: number;
  name?: string;
  url: string;
};

export type Data = {
  links: Link[];
  linkOpenStyle: boolean;
  columns?: number;
  visible?: boolean;
};

export type Props = API<Data>;

export const defaultData = {
  links: [{ url: "https://example.com" }],
  linkOpenStyle: false,
};
