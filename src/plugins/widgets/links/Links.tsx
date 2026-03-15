import React, { FC } from "react";
import { useKeyPress } from "../../../hooks";
import LinkEditorModal from "./LinkEditorModal";
import LinkTile from "./LinkTile";
import { Props, defaultData } from "./types";
import "./Links.sass";

const linksPerPage = 18;

const Links: FC<Props> = ({ data = defaultData, setData }) => {
  const [currentPage, setCurrentPage] = React.useState(0);
  const [editingIndex, setEditingIndex] = React.useState<number | null>(null);
  const [isManageMode, setIsManageMode] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isPageTransitioning, setIsPageTransitioning] = React.useState(false);
  const hasMounted = React.useRef(false);
  const isEditorOpen = isCreating || editingIndex !== null;

  useKeyPress(
    ({ key }) => {
      const index = Number(key) - 1;
      if (!isManageMode && data.links[index]) {
        data.linkOpenStyle
          ? window.open(data.links[index].url, "_blank")
          : window.location.assign(data.links[index].url);
      }
    },
    ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
  );

  const totalPages = Math.max(
    1,
    Math.ceil((data.links.length + (isManageMode ? 1 : 0)) / linksPerPage),
  );
  const safePage = Math.min(currentPage, totalPages - 1);
  const pageStart = safePage * linksPerPage;
  const pageLinks = data.links.slice(pageStart, pageStart + linksPerPage);
  const hasAddTile =
    isManageMode &&
    data.links.length < pageStart + linksPerPage &&
    pageLinks.length < linksPerPage;

  React.useEffect(() => {
    if (currentPage !== safePage) setCurrentPage(safePage);
  }, [currentPage, safePage]);

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    setIsPageTransitioning(true);
    const timeout = window.setTimeout(() => {
      setIsPageTransitioning(false);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [safePage]);

  React.useEffect(() => {
    if (!isManageMode || isEditorOpen) return;

    const dismiss = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(".LinkTile-hit") ||
        target?.closest(".LinkTile-edit") ||
        target?.closest(".LinkTile-delete") ||
        target?.closest(".Links-pagination") ||
        target?.closest(".Modal")
      ) {
        return;
      }
      setIsManageMode(false);
    };

    document.addEventListener("mousedown", dismiss);
    document.addEventListener("contextmenu", dismiss);

    return () => {
      document.removeEventListener("mousedown", dismiss);
      document.removeEventListener("contextmenu", dismiss);
    };
  }, [isEditorOpen, isManageMode]);

  const handleWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (totalPages <= 1) return;

    const delta = Math.sign(event.deltaY);
    if (delta === 0) return;

    event.preventDefault();
    setCurrentPage((page) => {
      if (delta > 0) return Math.min(page + 1, totalPages - 1);
      return Math.max(page - 1, 0);
    });
  };

  const saveLinks = (links: typeof data.links) => {
    setData({
      ...data,
      links,
    });
  };

  const openCreate = () => {
    setIsCreating(true);
    setEditingIndex(null);
    setIsManageMode(true);
  };

  const openEdit = (index: number) => {
    setEditingIndex(index);
    setIsCreating(false);
    setIsManageMode(true);
  };

  const closeEditor = () => {
    setEditingIndex(null);
    setIsCreating(false);
  };

  const handleSave = (link: (typeof data.links)[number]) => {
    if (isCreating) {
      saveLinks(data.links.concat(link));
      setCurrentPage(Math.floor(data.links.length / linksPerPage));
      return;
    }

    if (editingIndex === null) return;
    saveLinks(
      data.links.map((item, index) => (index === editingIndex ? link : item)),
    );
  };

  const removeAt = (index: number) => {
    saveLinks(data.links.filter((_, i) => i !== index));
    if (editingIndex === index) closeEditor();
  };

  return (
    <>
      <div
        className={`Links ${isManageMode ? "Links--manage" : ""}`}
        onWheel={handleWheel}
        onContextMenu={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest(".LinkTile-hit")) {
            event.preventDefault();
            setIsManageMode(true);
          }
        }}
      >
        <div
          className={`Links-grid ${isPageTransitioning ? "is-transitioning" : ""}`}
        >
          {pageLinks.map((link, index) => {
            const absoluteIndex = pageStart + index;
            return (
              <LinkTile
                isManageMode={isManageMode}
                key={`${link.url}-${absoluteIndex}`}
                link={link}
                onDelete={() => removeAt(absoluteIndex)}
                onEdit={() => openEdit(absoluteIndex)}
                onEnterManageMode={(event) => {
                  event.preventDefault();
                  setIsManageMode(true);
                }}
                openInNewTab={data.linkOpenStyle}
              />
            );
          })}

          {hasAddTile ? (
            <LinkTile
              isAddTile
              isManageMode={isManageMode}
              onAdd={openCreate}
              onEnterManageMode={(event) => {
                event.preventDefault();
                setIsManageMode(true);
              }}
              openInNewTab={data.linkOpenStyle}
            />
          ) : null}
        </div>

        {totalPages > 1 ? (
          <div className="Links-pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                aria-label={`Go to page ${index + 1}`}
                className={index === safePage ? "is-active" : ""}
                key={index}
                onClick={() => setCurrentPage(index)}
                type="button"
              />
            ))}
          </div>
        ) : null}
      </div>

      {isEditorOpen ? (
        <LinkEditorModal
          initialValue={
            editingIndex !== null ? data.links[editingIndex] : undefined
          }
          onClose={closeEditor}
          onDelete={
            editingIndex !== null
              ? () => {
                  removeAt(editingIndex);
                  closeEditor();
                }
              : undefined
          }
          onSave={handleSave}
        />
      ) : null}
    </>
  );
};

export default Links;
