import "./styles.css";

import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuItemProps,
} from "@radix-ui/react-dropdown-menu";

import { DropdownProps } from "./dropdown.type";

export const DropdownRoot = ({ children }: Partial<DropdownProps>) => {
  return <DropdownMenu modal={false}>{children}</DropdownMenu>;
};

export const DropdownTrigger = ({
  children,
  dataState,
  triggerStyle,
}: Partial<DropdownProps>) => {
  return (
    <DropdownMenuTrigger asChild>
      <button className={`trigger ${triggerStyle}`} data-row-active={dataState}>
        {children}
      </button>
    </DropdownMenuTrigger>
  );
};

export const DropdownContent = ({ children }: Partial<DropdownProps>) => {
  return (
    <DropdownMenuPortal>
      <DropdownMenuContent asChild sideOffset={4} align="center">
        <motion.div
          initial={{ opacity: 0.3, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: [0, 0.71, 0.2, 1.01],
          }}
          className="drop-content"
        >
          {children}
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenuPortal>
  );
};

export const DropdownItem = ({ children, ...props }: DropdownMenuItemProps) => {
  return (
    <DropdownMenuItem asChild {...props}>
      {children}
    </DropdownMenuItem>
  );
};
