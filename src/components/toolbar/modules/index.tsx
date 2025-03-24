import * as Toolbar from "@radix-ui/react-toolbar";

import { ModulesToolBarProps } from "../toolbar.type";

export const ToolbarRoot = ({ children }: ModulesToolBarProps) => {
  return <Toolbar.Root className="toolbar-root">{children}</Toolbar.Root>;
};

export const ToolbarGroup = ({
  children,
  type = "single",
}: ModulesToolBarProps) => {
  return (
    <Toolbar.ToggleGroup className="toolbar-group" type={type}>
      {children}
    </Toolbar.ToggleGroup>
  );
};

export const ToolbarItem = ({
  children,
  action,
  value = "",
  dataState,
}: ModulesToolBarProps) => {
  return (
    <Toolbar.ToggleItem
      className="toolbar-item"
      value={value}
      onClick={action}
      data-row-active={dataState}
    >
      {children}
    </Toolbar.ToggleItem>
  );
};

export const ToolbarButton = ({ children }: ModulesToolBarProps) => {
  return <Toolbar.Button asChild>{children}</Toolbar.Button>;
};
