import "./styles.css";

import * as Popover from "@radix-ui/react-popover";

import { PopoverProps } from "./popover.type";

export const BtnPopover = ({
  trigger,
  content,
  styles,
  sizes,
  isOpen,
  side,
  isChangeOpen,
}: PopoverProps) => {
  return (
    <Popover.Root open={isOpen} onOpenChange={isChangeOpen}>
      <Popover.Trigger asChild>
        <button className={`p-trigger ${styles} ${sizes}`}>{trigger}</button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          sideOffset={4}
          align="end"
          side={side}
          className="p-content"
        >
          {content}
          <Popover.Arrow className="p-arrow" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
