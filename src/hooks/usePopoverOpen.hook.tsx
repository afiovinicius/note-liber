import { useState } from "react";

export const usePopoverOpen = () => {
  const [isOpen, setIsOpen] = useState(false);
  return {
    isOpen,
    setIsOpen,
  };
};
