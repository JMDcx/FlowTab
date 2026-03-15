import React from "react";
import { Icon } from "../../../views/shared";
import { Link } from "./types";

const getDomain = (url: string): string | null => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

const getDisplayName = (link: Link): string => {
  if (link.name?.trim()) return link.name.trim();
  return getDomain(link.url) ?? link.url;
};

type Props = {
  isAddTile?: boolean;
  isManageMode: boolean;
  link?: Link;
  onAdd?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onEnterManageMode: (event: React.MouseEvent) => void;
  openInNewTab: boolean;
};

const LinkTile: React.FC<Props> = ({
  isAddTile = false,
  isManageMode,
  link,
  onAdd,
  onDelete,
  onEdit,
  onEnterManageMode,
  openInNewTab,
}) => {
  const [faviconFailed, setFaviconFailed] = React.useState(false);

  React.useEffect(() => {
    setFaviconFailed(false);
  }, [link?.url]);

  if (isAddTile) {
    return (
      <div className="LinkTile LinkTile--add">
        <button className="LinkTile-hit" onClick={onAdd} type="button">
          <span className="LinkTile-circle">
            <Icon name="plus" size={30} />
          </span>
        </button>
        <span className="LinkTile-label">Add</span>
      </div>
    );
  }

  if (!link) return null;

  const domain = getDomain(link.url);
  const label = getDisplayName(link);
  const fallbackLabel = (label[0] ?? "?").toUpperCase();

  const circle = (
    <span className="LinkTile-circle">
      {link.customIcon ? (
        <span
          className="LinkTile-customIcon"
          style={{
            backgroundImage: `url(${link.customIcon})`,
            backgroundPosition: `${link.iconPositionX ?? 50}% ${
              link.iconPositionY ?? 50
            }%`,
          }}
        />
      ) : !faviconFailed && domain ? (
        <img
          alt={label}
          onError={() => setFaviconFailed(true)}
          src={`https://icons.duckduckgo.com/ip3/${domain}.ico`}
        />
      ) : (
        <span className="LinkTile-fallback">{fallbackLabel}</span>
      )}
    </span>
  );

  if (isManageMode) {
    return (
      <div className="LinkTile LinkTile--manage" title={label}>
        <button
          className="LinkTile-delete"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onDelete?.();
          }}
          type="button"
        >
          <Icon name="x" size={16} />
        </button>
        <button
          className="LinkTile-edit"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onEdit?.();
          }}
          type="button"
        >
          <Icon name="edit-3" size={20} />
        </button>
        <button className="LinkTile-hit" onContextMenu={onEnterManageMode} type="button">
          {circle}
        </button>
        <span className="LinkTile-label">{label}</span>
      </div>
    );
  }

  return (
    <a
      className="LinkTile"
      href={link.url}
      onContextMenu={onEnterManageMode}
      rel="noopener noreferrer"
      target={openInNewTab ? "_blank" : "_self"}
      title={label}
    >
      <span className="LinkTile-hit">{circle}</span>
      <span className="LinkTile-label">{label}</span>
    </a>
  );
};

export default LinkTile;
