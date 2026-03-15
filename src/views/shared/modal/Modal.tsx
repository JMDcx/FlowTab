import React from "react";
import "./Modal.css";

type Props = {
  children: React.ReactNode;
  onClose: () => void;
};

const Modal: React.FC<Props> = ({ children, onClose }) => {
  const closeFromBackdrop = React.useRef(false);

  return (
    <div
      className="Modal-container"
      onMouseDown={(event) => {
        closeFromBackdrop.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        if (closeFromBackdrop.current && event.target === event.currentTarget) {
          onClose();
        }
        closeFromBackdrop.current = false;
      }}
    >
      <div className="Modal" onClick={(event) => event.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
