import "./styles.css";

import * as Toggle from "@radix-ui/react-toggle";

import { TToggleProps } from "./toggle.type";

export const BtnToggle = ({ children, sizes, ...props }: TToggleProps) => {
  return (
    <Toggle.Root {...props} className={`toggle ${sizes}`}>
      {children}
    </Toggle.Root>
  );
};
