import "./styles.css";

import { ButtonProps } from "./button.type";

export const Button = ({ children, styles, full, ...props }: ButtonProps) => {
  return (
    <button className={`btn ${styles} ${full && "full"}`} {...props}>
      {children}
    </button>
  );
};
