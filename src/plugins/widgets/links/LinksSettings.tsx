import React, { FC } from "react";
import { Props, defaultData } from "./types";

const LinksSettings: FC<Props> = ({ data = defaultData, setData }) => {
  return (
    <div className="LinksSettings">
      <label>
        <input
          type="checkbox"
          checked={data.linkOpenStyle}
          onChange={() =>
            setData({ ...data, linkOpenStyle: !data.linkOpenStyle })
          }
        />
        Links open in a new tab
      </label>

      <p className="LinksSettings-note">
        Right click any quick link on the dashboard to enter manage mode and
        add, edit, or remove sites.
      </p>
    </div>
  );
};

export default LinksSettings;
