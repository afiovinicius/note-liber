import "./styles.css";

import { forwardRef } from "react";

import { InputProps } from "./input.type";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, full, ...props }, ref) => {
    return (
      <input {...props} className={`input-body ${full && "full"}`} ref={ref} />
    );
  }
);
