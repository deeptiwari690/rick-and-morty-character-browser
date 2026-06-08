import type { ReactNode } from "react";
import styles from "./Button.module.css";

const { button, surface, surfaceObject } = styles;

type Props = {
  variant?: "surface" | "surfaceObject";
  children: ReactNode;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export function Button({ variant = "surface", children, type = "button", onClick, disabled }: Props) {
  return (
    <button
      className={`${button} ${variant === "surfaceObject" ? surfaceObject : surface}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}