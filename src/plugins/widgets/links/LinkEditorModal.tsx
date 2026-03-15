import React from "react";
import Button from "../../../views/shared/Button";
import Modal from "../../../views/shared/modal/Modal";
import { Link } from "./types";

type Props = {
  initialValue?: Link;
  onClose: () => void;
  onDelete?: () => void;
  onSave: (link: Link) => void;
};

const LinkEditorModal: React.FC<Props> = ({
  initialValue,
  onClose,
  onDelete,
  onSave,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [url, setUrl] = React.useState(initialValue?.url ?? "https://");
  const [name, setName] = React.useState(initialValue?.name ?? "");
  const [customIcon, setCustomIcon] = React.useState(
    initialValue?.customIcon ?? "",
  );
  const [iconPositionX, setIconPositionX] = React.useState(
    initialValue?.iconPositionX ?? 50,
  );
  const [iconPositionY, setIconPositionY] = React.useState(
    initialValue?.iconPositionY ?? 50,
  );
  const [error, setError] = React.useState("");

  const handleSave = (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const parsed = new URL(url);
      if (!/^https?:$/.test(parsed.protocol)) {
        throw new Error("URL must start with http:// or https://");
      }
      onSave({
        customIcon: customIcon || undefined,
        iconPositionX,
        iconPositionY,
        url: parsed.toString(),
        name: name.trim() || undefined,
      });
      onClose();
    } catch {
      setError("Please enter a valid website URL.");
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setCustomIcon(reader.result);
      }
    });
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const faviconDomain = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return null;
    }
  })();

  return (
    <Modal onClose={onClose}>
      <form className="LinksModal" onSubmit={handleSave}>
        <h3>{initialValue ? "Edit Quick Link" : "Add Quick Link"}</h3>

        <label>
          Website URL
          <input
            autoFocus
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              if (error) setError("");
            }}
            placeholder="https://example.com"
          />
        </label>

        <label>
          Label <span className="text--grey">(optional)</span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Website name"
          />
        </label>

        <div className="LinksModal-iconSection">
          <p className="LinksModal-sectionTitle">Icon</p>

          <div className="LinksModal-iconOptions">
            <div className="LinksModal-iconOption">
              <button
                className="LinksModal-iconButton"
                onClick={() => {
                  setCustomIcon("");
                  setIconPositionX(50);
                  setIconPositionY(50);
                }}
                type="button"
              >
                <span className="LinksModal-iconCircle">
                  {faviconDomain ? (
                    <img
                      alt="Website icon preview"
                      src={`https://icons.duckduckgo.com/ip3/${faviconDomain}.ico`}
                    />
                  ) : (
                    <span className="LinksModal-iconFallback">?</span>
                  )}
                </span>
              </button>
              <span>Website icon</span>
            </div>

            <div className="LinksModal-iconOption">
              <button
                className="LinksModal-iconButton"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <span className="LinksModal-iconCircle LinksModal-iconCircle--upload">
                  {customIcon ? (
                    <span
                      className="LinksModal-iconPreview"
                      style={{
                        backgroundImage: `url(${customIcon})`,
                        backgroundPosition: `${iconPositionX}% ${iconPositionY}%`,
                      }}
                    />
                  ) : (
                    <span className="LinksModal-iconPlus">+</span>
                  )}
                </span>
              </button>
              <span>{customIcon ? "Custom icon" : "Upload image"}</span>
            </div>
          </div>

          <input
            accept="image/*"
            hidden
            onChange={handleUpload}
            ref={fileInputRef}
            type="file"
          />

          {customIcon ? (
            <div className="LinksModal-cropControls">
              <label>
                Horizontal crop
                <input
                  max="100"
                  min="0"
                  onChange={(event) =>
                    setIconPositionX(Number(event.target.value))
                  }
                  type="range"
                  value={iconPositionX}
                />
              </label>

              <label>
                Vertical crop
                <input
                  max="100"
                  min="0"
                  onChange={(event) =>
                    setIconPositionY(Number(event.target.value))
                  }
                  type="range"
                  value={iconPositionY}
                />
              </label>

              <Button
                className="LinksModal-resetIcon"
                onClick={() => {
                  setCustomIcon("");
                  setIconPositionX(50);
                  setIconPositionY(50);
                }}
                type="button"
              >
                Use website icon
              </Button>
            </div>
          ) : null}
        </div>

        {error ? <p className="LinksModal-error">{error}</p> : null}

        <div className="LinksModal-actions">
          {onDelete ? (
            <Button
              className="button--danger"
              onClick={onDelete}
              type="button"
            >
              Delete
            </Button>
          ) : null}
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button primary type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LinkEditorModal;
