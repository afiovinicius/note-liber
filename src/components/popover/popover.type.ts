export type PopoverProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
  styles: "dark" | "brand";
  sizes: "sm" | "lg" | "sizing";
  isOpen: boolean;
  side: "top" | "right" | "bottom" | "left";
  isChangeOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
