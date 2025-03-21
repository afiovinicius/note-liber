import { ToggleProps } from "@radix-ui/react-toggle";

export type TToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ToggleProps & {
    children: React.ReactNode | JSX.Element;
    sizes: "sm" | "lg" | "sizing";
  };
