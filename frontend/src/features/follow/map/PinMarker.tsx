// PinMarker.tsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

type PinMarkerProps = {
  imageUrl: string;
  disabled: boolean;
  interactive?: boolean;
  onClick: React.MouseEventHandler<HTMLDivElement>;
};

export const PinMarker: React.FC<PinMarkerProps> = ({
  imageUrl,
  disabled,
  interactive = true,
  onClick,
}) => {
  const pinColor = disabled ? "#9E9E9E" : "#3A8049";
  const imgStyle = disabled
    ? {
        filter: "grayscale(100%)",
        opacity: 0.8,
        border: "2.5px solid rgba(0,0,0,0.15)",
      }
    : { filter: "none", opacity: 1, border: "2.5px solid transparent" };

  return (
    <div
      className="pin-marker"
      style={{
        position: "relative",
        width: 54,
        height: 70,
        pointerEvents: interactive ? "auto" : "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        cursor: interactive ? (disabled ? "default" : "pointer") : "default",
      }}
      onClick={interactive && !disabled ? onClick : undefined}
    >
      <FontAwesomeIcon
        icon={faLocationDot}
        style={{
          fontSize: 45,
          color: pinColor,
          filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.17))",
          position: "absolute",
          left: 0,
          top: 0,
          zIndex: 0,
        }}
      />
      <img
        src={imageUrl}
        alt="위치 마커"
        style={{
          position: "absolute",
          left: 12,
          top: 1,
          width: 27,
          height: 27,
          borderRadius: "50%",
          objectFit: "cover",
          boxShadow: "0 1.5px 4px rgba(0,0,0,0.13)",
          zIndex: 2,
          ...imgStyle,
        }}
      />
    </div>
  );
};
